# SpringBoot中各种成员的初始化顺序及静态成员的依赖注入

在把一个类的初始化的属性提出来写到配置件里的时候总出现构造函数先执行，使配置文件失效的情况，研究了下SpringBoot中类成员变量的初始化过程

比如我们有如下类

```java
@Component
public class A {

  @Autowired
  public B b;  // B is a bean

  public static C c;  // C is also a bean

  public static int count;

  public float version;

  public A() {
    System.out.println("This is A constructor.");
  }

  @Autowired
  public A(C c) {
    A.c = c;
    System.out.println("This is A constructor with c argument.");
  }

  @PostConstruct
  public void init() {
    count = 5;
    System.out.println("This is A post construct.");
  }
  
}
```

通过观察发现：

* 首先初始化的是static的成员变量，此处的count采用默认值0

* 然后初始化的是非static的成员变量，此处的version采用的是默认值0.0

* 然后Spring 在实例化A的对象时，采用的策略是：

  * 如果有@Autowired所修饰的构造函数，则采用该构造函数（注意，`@Autowired`只能修饰一个构造函数），否则采用默认的无参构造函数。此处采用的构造函数为

    ```java
     @Autowired
      public A(C c) {
        A.c = c;
        System.out.println("This is A constructor with c argument.");
      }
    ```

    **注意**：这个构造函数执行完之后成员变量B还没有没注入，值还是null

  * 注入 @Autowired修饰的成员变量，Spring容器选择合适的Bean注入b
  * 执行@PostConstruct 修饰的init()函数

总之，在上面这个例子中，各成员变量的执行顺序为：“static 成员变量 ”--> “非static成员变量” --> “被`@Autowired`修饰的构造函数” --> “被`@Autowired`修饰的成员变量b” --> “被`@PostConstruct`修饰的`init()`函数”。



## Tips

1. 有时我们想要对静态成员进行依赖注入（通常是Field dependency injection，即直接在成员上加`@Autowired`，此种做法不推荐），直接在静态成员上加`@Autowired`是无效的（其值总为null），这是因为静态成员变量是类的属性，不属于任何对象，而Spring实现Field dependency injection 是要依靠基于**实例**的reflection（反射）进行的。在这个例子中，Spring通过反射生成bean a, 并且发现a使用了bean b（此时bean b已经生成并被注册到Spring容器中），再次利用反射生成setter方法并将b set进a，这样就实现了Field dependency injection。通过上述过程我们可以知道static成员由于不属于任何实例，所以无法实现这样的依赖注入，但是我们可以通过Constructor dependency injection（构造函数依赖注入）来实现。以上面的例子为例，Spring在生成bean a（调用A的构造函数）时，由于A的构造函数带有参数c，Spring将在容器里寻找是否有符合c类型的bean，找到后将bean c赋值给构造函数的参数c，然后当执行到`A.c = c`时成员变量c就被“注入”成功了。

2. 如果我们希望某个Bean不要在Spring容器启动时初始化（这样可以加快应用的启动速度），而是在用到时才实例化，可以用@Lazy这个注解。将这个注解加在`@Bean、@Component、@Service、@Configuration`等注解上时，这些注解所修饰的Bean将在第一次**引用时**才实例化；如果在`@Autowired`上也同时加上这个注解，则该Bean将在第一次**使用时**实例化。我们再举个简单的例子：
   在`@Component`等注解上加`@Lazy`

```java
@Lazy
@Component
public class LazyBean {
  public LazyBean() {
    System.out.println("This is LazyBean constructor.");
  }
}
```

- 在UseBean里通过`@Autowired`注入LazyBean，不加`@Lazy`：

  ```java
  @Component
  public class UseBean {
    @Autowired
    private LazyBean lazyBean;
    public UseBean () {}
  }
  ```

当应用启动时，Spring要去扫描这些被`@Component`等注解修饰的类，立即将他们实例化并注册到容器中，但是由于LazyBean 类被`@Lazy`修饰，Spring会跳过这个Bean的实例化。当生成UseBean后（即Spring完成对UseBean的构造函数的调用后），由于UseBean引用了LazyBean，这个时候Spring才将LazyBean实例化。因此，以上Bean的初始化顺序永远是先初始化UseBean，当执行到`@Autowired private LazyBean lazyBean;`时才实例化lazyBean。

- 在`@Component`等注解和`@Autowired`上都加`@Lazy`

```java
 @Getter
 @Component
 public class UseBean {
   @Lazy
   @Autowired
   private LazyBean lazyBean;
   public UseBean () {}

   @PostConstruct
   public void init() {
     System.out.println(this.getLazyBean());
   }
 }
```

这种情况下即使执行到`@Autowired private LazyBean lazyBean;`时也没有真正实例化LazyBean ，只有在真正使用lazyBean时，即上述代码中的`this.getLazyBean()`时才开始调用LazyBean 的构造函数来实例化。



