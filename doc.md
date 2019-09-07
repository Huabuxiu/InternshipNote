```

```

#### 项目

- [internal-dubbo](https://code.aliyun.com/middlewarerace2019/dubbo-internal)

  比赛使用的特定版本 dubbo, 需要手动安装依赖。

  ```
  git clone https://code.aliyun.com/middlewarerace2019/dubbo-internal.git
  cd dubbo-internal
  mvn clean install -Dmaven.test.skip=true
  ```

- [adaptive-loadbalance](https://code.aliyun.com/middlewarerace2019/adaptive-loadbalance)

  选手按照题目提供的接口，实现 provider-consumer 协同的自适应负载均衡策略。

  ```
  git clone https://code.aliyun.com/middlewarerace2019/adaptive-loadbalance.git
  cd adaptive-loadbalance
  mvn clean install -Dmaven.test.skip=true
  ```

- [internal-service](https://code.aliyun.com/middlewarerace2019/internal-service)

  内置服务，负责加载选手实现的负载均衡算法，启动 Consumer 和 Provider 程序。已经由赛题官方提供，开发过程不需要修改，只需要安装依赖。

  ```
  git clone https://code.aliyun.com/middlewarerace2019/internal-service.git
  cd internal-service
  mvn clean install -Dmaven.test.skip=true
  ```

#### 本地开发

- fork 本项目, clone 自己的仓库到本地

- 配置 hosts，指向本地 IP ,或者将 internal-service 项目中的 `com.aliware.tianchi.netty.HttpProcessHandler#buildUrls` 相关地址修改为本地 IP,也可以在 `buildUrls` 中添加多个不同的 Provider 地址。

  ```
  ${宿主机IP地址} provider-small
  ${宿主机IP地址} provider-medium
  ${宿主机IP地址} provider-large
  ```

- 构建 `dubbo-internal` 项目，命令在上节已给出。

- 构建 demo 的 workspace 项目（即本项目）

- 运行 `internal-service` 项目中的 `com.aliware.tianchi.MyProvider` 启动 Provider，为了模拟负载均衡场景，需要启动三个 Provider，分别指定启动参数 `-Dquota=large`、`-Dquota=medium`、`-Dquota=small`

- 运行 `internal-service` 项目中的 `com.aliware.tianchi.MyConsumer` 启动 Consumer

- 打开浏览器 http://localhost:8087/call，显示`OK`即表示配置成功。

#### 本地压测

在 `internal-service` 项目中存放了一个 wrk.lua 脚本，选手可以在该项目根目录下执行

```
wrk -t4 -c1024 -d90s -T5 --script=./wrk.lua --latency http://localhost:8087/invoke
```

进行压测，压测前请确认本机已安装压测工具 wrk