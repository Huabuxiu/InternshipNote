# 使用mybatis generator

为了方便使用mybatis generator会方便许多，他会根据数据库，把数据库中的表映射成一个mapper接口和SQL的xml文档，避免了自己书写SQL文件和创建对应class的工作，而且可以直接调用。

## 添加依赖

1. Mybatis 和数据库连接依赖

```xml
				 <!-- Mybatis相关支持库 - 开始 -->
        <page_helper_version>1.2.2</page_helper_version>

        <mybatis_spring_version>1.3.1</mybatis_spring_version>
        <!-- Mybatis相关支持库 - 结束 -->


 <!-- Mybatis相关支持库 - 开始 -->
        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper-spring-boot-starter</artifactId>
            <version>${page_helper_version}</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>${mybatis_spring_version}</version>
        </dependency>
        <!-- Mybatis相关支持库 - 结束 -->

        <!--mybatis 分页依赖-->
 				<dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper-spring-boot-starter</artifactId>
            <version>1.2.3</version>
        </dependency>


				<!--数据库连接依赖-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.46</version>
        </dependency>
			

```

2. 添加mybatis generator插件

```xml
   <plugin>
                <groupId>org.mybatis.generator</groupId>
                <artifactId>mybatis-generator-maven-plugin</artifactId>
                <version>1.3.2</version>
                <configuration>
                  <!--配置文件位置-->
                    <configurationFile>mybatisgenerator/generatorConfig.xml</configurationFile>
                    <overwrite>true</overwrite>
                    <verbose>true</verbose>
                </configuration>
                <executions>
                    <execution>
                        <id>Generate MyBatis Artifacts</id>
                        <phase>none</phase>
                        <goals>
                            <goal>generate</goal>
                        </goals>
                    </execution>
                </executions>
                <dependencies>
                    <dependency>
                        <groupId>mysql</groupId>
                        <artifactId>mysql-connector-java</artifactId>
                        <version>5.1.46</version>
                    </dependency>
                    <dependency>
                        <groupId>com.softwareloop</groupId>
                        <artifactId>mybatis-generator-lombok-plugin</artifactId>
                        <version>1.0</version>
                    </dependency>
                </dependencies>
            </plugin>
```

3. 配置mybatis generator 配置文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

<generatorConfiguration>

    <properties resource="jdbc.properties"/>

    <context id="example" targetRuntime="MyBatis3">

        <plugin type="org.mybatis.generator.plugins.RowBoundsPlugin"/>

        <commentGenerator>
            <property name="suppressAllComments" value="true"/>
            <property name="suppressDate" value="true"/>
        </commentGenerator>
<!-- 数据库驱动等等-->
        <jdbcConnection driverClass="${jdbc.driverClassName}"
                        connectionURL="${jdbc.service_url}" userId="${jdbc.service_username}"
                        password="${jdbc.service_password}"/>

        <javaTypeResolver>
            <property name="forceBigDecimals" value="false"/>
        </javaTypeResolver>
<!-- 生成模型的包名和位置-->
        <javaModelGenerator targetPackage="com.wisely.demo.dao"
                            targetProject="src/main/java">
            <property name="enableSubPackages" value="false"/>
            <property name="trimStrings" value="true"/>
        </javaModelGenerator>
  <!-- 生成映射文件的包名和位置-->
        <sqlMapGenerator targetPackage="com.wisely.demo.dao.mapper" targetProject="src/main/java">
            <!--<property name="enableSubPackages" value="true"/>-->
        </sqlMapGenerator>

    <!-- 生成DAO的包名和位置-->
        <javaClientGenerator targetPackage="com.wisely.demo.dao.mapper"
                             targetProject="src/main/java" type="MIXEDMAPPER">
            <property name="enableSubPackages" value="false"/>
        </javaClientGenerator>
<!-- 表名和要对应的映射出来的do实体的名称-->
        <table tableName="db_test" domainObjectName="dbDO">
            <generatedKey column="id" sqlStatement="MySql" identity="true"/>
        </table>
    </context>
</generatorConfiguration>

```

4. 配置数据库连接文件等等

```properties
#jdbc.properties
jdbc.driverClassName=com.mysql.jdbc.Driver
jdbc.service_url=jdbc:mysql://localhost:3306/mysql_test
jdbc.service_username=root
jdbc.service_password=123456
jdbc.service_initialSize=8
jdbc.service_minIdle=8
jdbc.service_maxActive=16

```

5. 在maven中使用插件 

![image-20190820144034033](/Users/eleme/Documents/markdown/img/generator插件.png)

