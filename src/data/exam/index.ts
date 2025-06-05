export const cards = ([
    { icon: '/exam/选择题.svg', title: '单选题', accNum: 10, examNum: 200 },
    { icon: '/exam/多选题.svg', title: '多选题', accNum: 0, examNum: 30 },
    { icon: '/exam/judge.svg', title: '判断题', accNum: 20, examNum: 200 },
    { icon: '/exam/填空题.svg', title: '填空题', accNum: 0, examNum: 200 },
    { icon: '/exam/主观题.svg', title: '主观题', accNum: 0, examNum: 200 },
    { icon: '/exam/mathml.svg', title: '函数题', accNum: 0, examNum: 200 },
    { icon: '/exam/编程题.svg', title: '编程题', accNum: 199, examNum: 200 },
    { icon: '/exam/多文件夹.svg', title: '多文件题编程题', accNum: 0, examNum: 200 }
]);

export const legends = [
    { id: 1, 
      img: '/exam/legend/待评测.png',
      text: '待评测' },
    { id: 2,
      img: '/exam/legend/答案正确.png',
      text: '答案正确' },
    { id: 3,
      img: '/exam/legend/答案错误.png',
      text: '答案错误' },
    { id: 4,
      img: '/exam/legend/标记.png',
      text: '标记' }
]

export const singleChoiceList = ([
{
    id: "1-1",
    score: 2,
    question: "以下代码的输出是什么？\nint a = 10;\nint &b = a;\nb = 20;\ncout << a;",
    options: [
    "10",
    "20",
    "编译错误",
    "运行时错误"
    ],
    correctIndex: 1,
    explanation: "这是一条解析，如果有，则动画弹出"
},
{
    id: "1-2",
    score: 1,
    question: "哪个选项正确声明了指向数组的指针？",
    options: [
    "int *ptr[5];",
    "int (*ptr)(5);",
    "int (*ptr)[5];",
    "int *ptr = new int[5];"
    ],
    correctIndex: 2
},
{
    id: "1-3",
    score: 3,
    question: "关于虚函数的描述正确的是：",
    options: [
    "构造函数可以是虚函数",
    "虚函数使用static关键字",
    "虚函数实现运行时多态",
    "析构函数不能是虚函数"
    ],
    correctIndex: 2
},
{
    id: "1-4",
    score: 2,
    question: "下列哪个是合法的C++标识符？",
    options: [
    "3d_vector",
    "_private",
    "case",
    "var-name"
    ],
    correctIndex: 1
},
{
    id: "1-5",
    score: 3,
    question: "关于智能指针的说法正确的是：",
    options: [
    "unique_ptr不支持移动语义",
    "shared_ptr使用引用计数",
    "weak_ptr会增加引用计数",
    "auto_ptr是C++11推荐使用的"
    ],
    correctIndex: 1
},
])

export const mulChoiceList = ([
  {
    id: "1-1",
    score: 3,
    question: "以下哪些是C++的关键字？",
    options: [
      "class",
      "module",
      "delete",
      "finally"
    ],
    correctIndices: [0, 2],
    explanation: "这是一条解析，如果有，则动画弹出"
  },
  {
    id: "1-2",
    score: 5,
    question: "哪些特性属于面向对象编程？",
    options: [
      "封装",
      "函数重载",
      "多态",
      "模板"
    ],
    correctIndices: [0, 2],
  },
  {
    id: "1-3",
    score: 2,
    question: "下列哪些智能指针支持共享所有权？",
    options: [
      "unique_ptr",
      "shared_ptr",
      "weak_ptr",
      "auto_ptr"
    ],
    correctIndices: [1, 2],
    explanation: "shared_ptr使用引用计数实现共享所有权，weak_ptr是配套观察指针。unique_ptr独占所有权，auto_ptr已废弃。"
  },
  {
    id: "1-4",
    score: 5,
    question: "哪些操作会导致迭代器失效？",
    options: [
      "vector插入元素",
      "set删除元素",
      "map查找元素",
      "deque push_front"
    ],
    correctIndices: [0, 1, 3],
    explanation: "顺序容器插入/删除可能使迭代器失效，关联容器删除元素会使指向被删元素的迭代器失效。查找操作不会失效。"
  },
  {
    id: "1-5",
    score: 5,
    question: "下列哪些函数不能声明为虚函数？",
    options: [
      "构造函数",
      "静态成员函数",
      "友元函数",
      "析构函数"
    ],
    correctIndices: [0, 1, 2],
    explanation: "构造函数、静态成员函数、友元函数都不能是虚函数。析构函数通常应该声明为虚函数以实现多态删除。"
  }
])

export const judgeList = [
  {
    id: "3-1",
    score: 2,
    question: "引用变量b是a的拷贝副本？",
    correctIndex: 1,
    explanation: "这是一条解析，如果有，则动画弹出"
  },
  {
    id: "3-2",
    score: 1,
    question: "int (*ptr)[5] 是声明指向数组的指针的正确方式？",
    correctIndex: 0
  },
  {
    id: "3-3",
    score: 3,
    question: "虚函数通过编译时绑定实现多态？",
    correctIndex: 1
  },
  {
    id: "3-4",
    score: 2,
    question: "C++标识符允许以数字开头？",
    correctIndex: 1
  },
  {
    id: "3-5",
    score: 3,
    question: "shared_ptr通过引用计数管理资源？",
    correctIndex: 0
  }
]

export const blankList = [
  {
    id: "4-1",
    score: [1, 1],
    question: "C++中用于标准输出的语句是 std::_____ << \"Hello\";，换行操作符是 _____。",
    correctAnswers: ["cout", "endl"],
    explanation: "cout是标准输出流对象，endl用于插入换行符并刷新缓冲区"
  },
  {
    id: "4-2",
    score: [1, 1],
    question: "动态内存分配的运算符是 _____，释放内存的运算符是 _____。",
    correctAnswers: ["new", "delete"],
    explanation: "new用于动态内存分配，delete用于释放new分配的内存"
  },
  {
    id: "4-3",
    score: [3],
    question: "在C++中，必须在声明时初始化的引用类型称为 _____ 引用。",
    correctAnswers: ["左值"],
    explanation: "左值引用（类型&）必须绑定到已存在的对象，且不能改变绑定对象"
  },
  {
    id: "4-4",
    score: [2],
    question: "类成员的默认访问权限是 _____（public/protected/private）。",
    correctAnswers: ["private"],
    explanation: "class定义的类成员默认private，struct定义的默认public"
  },
  {
    id: "4-5",
    score: [2],
    question: "STL中实现动态数组的容器是 _____，其扩容机制是倍增策略。",
    correctAnswers: ["vector"],
    explanation: "vector容器支持随机访问和动态扩容，是C++中最常用的顺序容器"
  }
]

export const subjectiveList = [
  {
    id: "5-1",
    title: "面向对象编程基础",
    question: "请解释C++中面向对象编程的三大基本特性，并结合实际代码示例说明封装是如何实现的。", 
    score: 10,
    passNum: 45,
    totalNum: 80,
    reveal: false,
    explanation: `
封装是面向对象的重要特性，主要通过访问修饰符实现：
1. 使用private隐藏类的内部实现细节
2. 通过public方法提供对外接口
示例：
class BankAccount {
private:
    double balance; // 封装余额数据
public:
    void deposit(double amount) { // 公开操作方法
        if(amount > 0) balance += amount;
    }
};`
  },
  {
    id: "5-2",
    title: "智能指针应用",
    question: "请比较unique_ptr、shared_ptr和weak_ptr三种智能指针的特性差异，并举例说明shared_ptr循环引用问题的产生原因及解决方案。",
    score: 15,
    passNum: 32,
    totalNum: 68,
    explanation: `
关键差异：
- unique_ptr独占所有权，支持移动语义
- shared_ptr通过引用计数共享所有权
- weak_ptr观察shared_ptr但不增加计数

循环引用示例：
class B;
class A {
    shared_ptr<B> b_ptr;
};
class B {
    shared_ptr<A> a_ptr;
};
// 使用weak_ptr打破循环：
class B {
    weak_ptr<A> a_weak_ptr;
}`
  },
  {
    id: "5-3",
    title: "模板元编程",
    question: "编写一个计算斐波那契数列的模板元程序，要求实现编译期计算，并解释模板参数推导的过程。",
    score: 20,
    passNum: 28,
    totalNum: 50,
    explanation: `
模板元实现：
template<int N>
struct Fibonacci {
    static const int value = Fibonacci<N-1>::value + Fibonacci<N-2>::value;
};
template<>
struct Fibonacci<0> { static const int value = 0; };
template<>
struct Fibonacci<1> { static const int value = 1; };

// 使用：
cout << Fibonacci<10>::value;  // 编译期计算55

推导过程：
编译器通过模板特化和递归展开在编译阶段完成计算，
生成的目标代码直接包含结果值。`
  },
  {
    id: "5-4",
    title: "多线程同步",
    question: "解释C++中mutex与atomic的区别，并给出使用条件变量实现生产者-消费者模式的代码片段。",
    score: 15,
    passNum: 38,
    totalNum: 72,
    explanation: `
关键区别：
- mutex用于临界区互斥访问
- atomic保证单一变量的原子操作

生产者-消费者示例：
std::mutex mtx;
std::condition_variable cv;
queue<int> buffer;

void producer() {
    std::unique_lock<std::mutex> lock(mtx);
    buffer.push(data);
    cv.notify_one();
}`
  },
  {
    id: "5-5",
    title: "设计模式",
    question: "用C++实现线程安全的单例模式，要求包含双检锁优化并解释其必要性。",
    score: 20,
    passNum: 26,
    totalNum: 65,
    explanation: `
实现代码：
class Singleton {
    static Singleton* instance;
    static std::mutex mtx;
    
    Singleton() {}
public:
    static Singleton* getInstance() {
        if(!instance) { // 第一次检查
            std::lock_guard<std::mutex> lock(mtx);
            if(!instance) { // 第二次检查
                instance = new Singleton();
            }
        }
        return instance;
    }
};
// 双检锁有效减少锁竞争`
  },
  {
    id: "5-6",
    title: "异常处理",
    question: "编写一个带有异常安全保证的资源管理类，展示try-catch块和RAII的结合使用。",
    score: 12,
    passNum: 43,
    totalNum: 75,
    explanation: `
示例代码：
class SafeResource {
    FILE* file;
public:
    SafeResource(const char* path) try : file(fopen(path, "r")) {
        if(!file) throw std::runtime_error("Open failed");
    } catch(...) {
        // 自动清理已分配资源
        if(file) fclose(file);
    }
    
    ~SafeResource() { if(file) fclose(file); }
};`
  },
  {
    id: "5-7",
    title: "STL容器",
    question: "解释vector的扩容机制，计算插入n个元素时的总复制次数，给出时间复杂度分析。",
    score: 18,
    passNum: 37,
    totalNum: 82,
    explanation: `
扩容策略：
- 常见扩容因子为2倍
- 总复制次数 = 1 + 2 + 4 + ... + 2^(k-1) ≈ 2n
时间复杂度：均摊O(1)插入操作`
  },
  {
    id: "5-8",
    title: "移动语义",
    question: "实现一个带有移动构造函数和移动赋值运算符的字符串类，解释何时触发移动操作。",
    score: 16,
    passNum: 29,
    totalNum: 60,
    explanation: `
代码实现：
class MyString {
    char* data;
public:
    // 移动构造函数
    MyString(MyString&& other) noexcept 
        : data(other.data) {
        other.data = nullptr;
    }
    
    // 移动赋值运算符
    MyString& operator=(MyString&& rhs) noexcept {
        if(this != &rhs) {
            delete[] data;
            data = rhs.data;
            rhs.data = nullptr;
        }
        return *this;
    }
};
触发场景：返回临时对象、std::move显式转换`
  },
  {
    id: "5-9",
    title: "类型推导",
    question: "解释auto和decltype的类型推导规则差异，给出需要显式指定类型的场景示例。",
    score: 14,
    passNum: 48,
    totalNum: 90,
    explanation: `
关键区别：
- auto去除引用和顶层const
- decltype保留表达式的完整类型信息

需要显式指定示例：
auto val = get_value(); // 无法推导期望的引用类型
应改为：auto&& val = get_value();`
  },
  {
    id: "5-10",
    title: "Lambda表达式",
    question: "编写一个捕获列表包含[=, &x]的lambda函数，解释这种混合捕获方式的合法性及潜在风险。",
    score: 13,
    passNum: 39,
    totalNum: 85,
    explanation: `
示例代码：
int x = 10;
auto lambda = [=, &x]() { 
    // 值捕获所有变量，但x采用引用捕获
    return x + some_val; 
};

潜在风险：
1. 引用捕获可能导致悬垂引用
2. 值捕获和引用捕获混合可能引发理解困难`
  },
  {
    id: "5-11",
    title: "虚函数机制",
    question: "画出含有虚函数的类内存布局图，解释vptr和vtable的创建时机及多态实现原理。",
    score: 20,
    passNum: 22,
    totalNum: 55,
    explanation: `
内存布局：
| vptr       | --> vtable
| 成员变量    |

创建时机：
- vtable在编译期生成
- vptr在对象构造时初始化

多态实现：
通过vtable中的函数指针实现动态绑定`
  },
  {
    id: "5-12",
    title: "模板特化",
    question: "编写一个类型萃取模板，能够检测某个类型是否包含iterator嵌套类型。",
    score: 17,
    passNum: 31,
    totalNum: 63,
    explanation: `
实现代码：
template<typename T>
struct has_iterator {
    template<typename U>
    static auto test(int) -> decltype(typename U::iterator(), std::true_type{});
    
    template<typename>
    static std::false_type test(...);
    
    static constexpr bool value = decltype(test<T>(0))::value;
};`
  },
  {
    id: "5-13",
    title: "内存对齐",
    question: "使用alignas关键字设计一个缓存行对齐的结构体，解释为什么需要64字节对齐。",
    score: 15,
    passNum: 27,
    totalNum: 58,
    explanation: `
结构体定义：
struct alignas(64) CacheLine {
    char data[64];
};

对齐原因：
现代CPU缓存行通常为64字节，避免伪共享`
  },
  {
    id: "5-14",
    title: "并发容器",
    question: "对比std::vector和tbb::concurrent_vector的线程安全性，给出后者push_back操作的实现原理。",
    score: 19,
    passNum: 24,
    totalNum: 50,
    explanation: `
关键区别：
- std::vector需要外部同步
- tbb::concurrent_vector使用分段锁

实现原理：
1. 分段存储数据
2. 追加元素时仅锁定相关段
3. 迭代器遍历时自动处理段间关系`
  },
  {
    id: "5-15",
    title: "编译优化",
    question: "解释NRVO（返回值优化）与移动语义的关系，给出禁用NRVO仍能高效返回对象的实现方法。",
    score: 16,
    passNum: 34,
    totalNum: 70,
    explanation: `
关系说明：
- NRVO是编译器优化
- 移动语义提供语言层保障

实现方法：
MyObject create() {
    MyObject obj;
    // ...处理逻辑
    return std::move(obj); // 显式启用移动语义
}`
  },
  {
    id: "5-16",
    title: "类型擦除",
    question: "使用std::function实现类型擦除模式，解释其如何持有任意可调用对象。",
    score: 14,
    passNum: 41,
    totalNum: 88,
    explanation: `
实现原理：
1. 通过模板构造函数捕获可调用对象
2. 使用虚函数表实现多态调用
3. 小对象优化（SBO）避免堆分配

示例：
std::function<void()> func = [](int x){ /*...*/ };`
  },
  {
    id: "5-17",
    title: "网络编程",
    question: "编写TCP服务端的关键步骤代码，包含socket创建、bind、listen和accept循环。",
    score: 18,
    passNum: 29,
    totalNum: 62,
    explanation: `
核心代码：
int sock = socket(AF_INET, SOCK_STREAM, 0);
sockaddr_in addr{AF_INET, htons(8080), INADDR_ANY};
bind(sock, (sockaddr*)&addr, sizeof(addr));
listen(sock, SOMAXCONN);

while(true) {
    int client = accept(sock, nullptr, nullptr);
    // 创建线程处理client
}`
  },
  {
    id: "5-18",
    title: "元组展开",
    question: "使用折叠表达式实现打印任意长度tuple元素的函数模板。",
    score: 15,
    passNum: 33,
    totalNum: 68,
    explanation: `
实现代码：
template<typename... Ts>
void print_tuple(const std::tuple<Ts...>& tpl) {
    std::apply([](auto&&... args) {
        ((std::cout << args << " "), ...);
    }, tpl);
}`
  },
  {
    id: "5-19",
    title: "协程基础",
    question: "编写一个C++20协程的generator示例，实现斐波那契数列的惰性求值。",
    score: 20,
    passNum: 18,
    totalNum: 40,
    explanation: `
代码实现：
generator<int> fib(int n) {
    int a = 0, b = 1;
    while(n--) {
        co_yield a;
        auto next = a + b;
        a = b;
        b = next;
    }
}`
  },
  {
    id: "5-20",
    title: "内存管理",
    question: "解释C++中new/delete与malloc/free的本质区别，并说明为什么不应该混用它们。",
    score: 12,
    passNum: 41,
    totalNum: 88,
    explanation: `
主要区别：
1. new调用构造函数，malloc只分配内存
2. delete调用析构函数，free只释放内存
混用会导致：
- 对象构造/析构不完整
- 内存泄漏风险增加`
  }
]

export const programList = [
  {
    id: "7-1",
    title: "基本输入输出",
    question: "编写一个C++程序，从标准输入接收两个整数，输出它们的和。要求给出完整代码实现。", 
    score: 10,
    passNum: 52,
    totalNum: 90,
    reveal: false,
    explanation: ``
  },
  {
    id: "7-2",
    title: "条件语句应用",
    question: "编写一个函数判断某年份是否为闰年，函数签名为：bool isLeapYear(int year)。要求写出完整实现。",
    score: 10,
    passNum: 68,
    totalNum: 85,
    reveal: false,
    explanation: ``
  },
  {
    id: "7-3",
    title: "循环结构练习",
    question: "使用for循环编写程序，计算并输出1到100之间所有奇数的平方和。要求给出完整代码。",
    score: 10,
    passNum: 47,
    totalNum: 78,
    reveal: false,
    explanation: ``
  },
  {
    id: "7-4",
    title: "数组操作基础",
    question: "编写函数找出整型数组中的最大值，函数签名为：int findMax(int arr[], int size)。要求给出实现代码。",
    score: 10,
    passNum: 63,
    totalNum: 88,
    reveal: false,
    explanation: ``
  },
  {
    id: "7-5",
    title: "字符串反转",
    question: "编写一个不使用标准库函数的字符串反转程序，函数签名为：void reverseString(char str[])。给出完整实现。",
    score: 10,
    passNum: 39,
    totalNum: 72,
    reveal: false,
    explanation: ``
  },
  {
    id: "7-6",
    title: "指针应用",
    question: "使用指针实现两个整数的交换，写出完整的函数：void swap(int* a, int* b)。要求包含函数调用示例。",
    score: 10,
    passNum: 58,
    totalNum: 82,
    reveal: false,
    explanation: ``
  },
  {
    id: "7-7",
    title: "递归函数",
    question: "用递归实现斐波那契数列第n项的计算，函数签名为：int fibonacci(int n)。给出完整函数实现。",
    score: 10,
    passNum: 41,
    totalNum: 75,
    reveal: false,
    explanation: ``
  },
  {
    id: "7-8",
    title: "类与对象",
    question: "定义一个矩形类Rectangle，包含长、宽属性和计算面积的方法。要求写出完整的类定义。",
    score: 10,
    passNum: 55,
    totalNum: 80,
    reveal: false,
    explanation: ``
  },
  {
    id: "7-9",
    title: "文件操作",
    question: "编写程序将用户输入的内容写入到名为output.txt的文件中，要求包含完整的文件操作代码。",
    score: 10,
    passNum: 36,
    totalNum: 65,
    reveal: false,
    explanation: ``
  },
  {
    id: "7-10",
    title: "动态内存",
    question: "使用new运算符创建包含10个元素的整型数组，赋值后输出数组内容，最后释放内存。给出完整代码。",
    score: 10,
    passNum: 44,
    totalNum: 70,
    reveal: false,
    explanation: ``
  }
]