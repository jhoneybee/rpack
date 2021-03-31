---
nav:
  title: 组件
  path: /components
group:
  path: /components/input
  title: 数据录入
title: Form 表单组件
---

# Form 表单组件

## 代码演示


<code src="./demo/simple.tsx" />

<code src="./demo/linkage.tsx" />

<code src="./demo/modal.tsx" />

## API

Form属性说明如下：

|属性            |说明	                                              |类型	                          |默认值
|-----          |------                                              |-----                          |-------
|cols           | 当前列的总数                                        | `number`                       | `5`
|onFinish       | 提交表单且数据验证成功后回调事件                      | `Function(values)`             |
|onFinishFailed | 提交表单且数据验证失败后回调事件                      | `Function({ values, errorFields, outOfDate })`|
|onFieldsChange | 字段更新时触发回调事件                               | `Function(changedFields, allFields)`
|onValuesChange | 字段值更新时触发回调事件                             | `Function(changedValues, allValues)`
|form           | form实例对象                                       | `React.MutableRefObject` | -


## Form.Item

|属性          |说明	       |类型	     |默认值
|-----        |------       |-----      |-------
|label        | 标签的文本   | `string`  | - 
|name         | 字段名       | `string` | -
|rules        | 字段校验规则  | `Rule[]` | - 
|shouldUpdate | 自定义字段更新逻辑| `(prevValue, curValue) => boolean` | -
|validateFirst| 当某一规则校验不通过时，是否停止剩下的规则的校验 | `boolean` | `false`
|hidden       | 是否隐藏字段（依然会收集和校验字段） | `boolean`| `false`
|dependencies | 设置依赖字段  | `string[]`  | -
|labelWidth     | 固定Form的宽度 | `number`| -

### dependencies
当字段间存在依赖关系时使用。如果一个字段设置了 `dependencies` 属性。那么它所依赖的字段更新时，该字段将自动触发更新与校验。一种常见的场景，就是注册用户表单的"密码"与"确认密码"字段。"确认密码"校验依赖于"密码"字段，设置 `dependencies` 后，“密码”字段更新会重新触发 "校验密码" 的校验逻辑。


## FormInstance 

|属性                    |说明	                  |类型	     |默认值
|-----                  |------                  |-----      |-------
|getFieldInstance       | 获取对应字段示例         | `(name: NamePath) => any`
|getFieldValue          | 获取对应字段名的值 |`(name: NamePath) => any`
|getFieldsValue         | 获取一组字段名对应的值，会按照对应结构返回| `(nameList?: NamePath[], filterFunc?: (meta: { touched: boolean, validating: boolean }) => boolean) => any`
|getFieldError          | 获取对应字段名的错误信息|`(name: NamePath) => string[]`
|getFieldsError         | 获取一组字段名对应的错误信息，返回为数组形式|`(nameList?: NamePath[]) => FieldError[]	`
|isFieldTouched         | 检查对应字段是否被用户操作过|`(name: NamePath) => boolean`
|isFieldsTouched        | 检查一组字段是否被用户操作过，`allTouched` 为 `true` 时检查是否所有字段都被操作过|`(nameList?: NamePath[], allTouched?: boolean) => boolean`
|isFieldValidating      | 检查一组字段是否正在校验|`(name: NamePath) => boolean`
|resetFields            | 重置一组字段到 `initialValues`|`(fields?: NamePath[]) => void`
|scrollToField          | 滚动到对应字段位置|`(name: NamePath, options: [ScrollOptions]) => void`
|setFields              | 设置一组字段状态|`(fields: FieldData[]) => void`
|setFieldsValue         | 设置表单的值|`(values) => void`
|submit                 | 提交表单，与点击 `submit` 按钮效果相同|`() => void`
|validateFields         | 触发表单验证|`(nameList?: NamePath[]) => Promise`

## Rule

|属性                    |说明	                  |类型	     |默认值
|-----                  |------                  |-----      |-------
|enum                   |是否匹配枚举中的值|	`any[]`
|len	                  |string 类型时为字符串长度;number 类型时为确定数字; array 类型时为数组长度|`number`
|max                    |必须设置 type:string 类型为字符串最大长度;number 类型时为最大值;array 类型时为数组最大长度|`number`
|message                |错误信息，不设置时会通过模板自动生成|`string`
|min                    |必须设置 type：string 类型为字符串最小长度；number 类型时为最小值；array 类型时为数组最小长度|`number`
|pattern                |正则表达式匹配|`RegExp`
|required               |是否为必选字段|`boolean`
|transform              |将字段值转换成目标值后进行校验|`(value) => any`
|type                   |类型，常见有 string \|number \|boolean \|url \| email。更多请参考此处|`string`
|validator              |自定义校验，接收 Promise 作为返回值。示例参考|`(rule, value) => Promise`
|whitespace             |如果字段仅包含空格则校验不通过| `boolean`
