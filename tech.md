- vue3的setup 语法糖取消了this指针的使用 可以通过直接调用，不依赖this指针，防止this指针丢失或指向性问题
- 箭头函数不创建自己的this 而是继承外部作用域
- ！告诉编译器该变量不会是undefine课以安全调用该方法