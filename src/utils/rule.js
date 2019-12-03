
export let requiredRules = (name) => {
  return v => (!!v && v.length !== 0) || `${name}不能为空`
}

export let requiredMessageRules = (name) => {
  return v => (!!v && v.length !== 0) || `${name}不合法`
}

export let imageRequiredRules = (name, size) => {
  return v => !v || v.size < size || `${name}图片大小要小于${size / 1000000}MB`
}

export let maxLengthRules = (maxLength) => {
  return v => !v || v.length < maxLength || `长度不能大于${maxLength}位`
}
export let integerRules = [
  v => /^[0-9]*[1-9][0-9]*$/.test(v) || '不能输入非正整数'
]

export let phoneRules = [
  v => !!v || '电话号码不能为空',
  v => (v && v.length === 11) || '电话号码必须是11位'
]

export let emailRules = [
  v => !!v || '邮箱不能为空',
  v => /.+@.+\..+/.test(v) || '电子邮箱不规范',
  v => (v && v.length <= 30) || '邮箱长度不能大于30位'
]

export let passwordRules = [
  v => !!v || '密码不能为空',
  v => (v && v.length >= 8) || '密码不能少于8位',
  v => (v && v.length <= 18) || '密码不能大于18位'
]

export let codeRules = [
  v => !!v || '验证码不能为空',
  v => (v && v.length === 4) || '验证码是4位'
]

export let unionRules = (...args) => {
  let result = []
  args.forEach(value => {
    if (typeof value === 'function') {
      result.push(value)
    } else if (value instanceof Array) {
      result = result.concat(value)
    } else {
      throw Error('typeError', 'Type must be an array or a function')
    }
  })
  return result
}
