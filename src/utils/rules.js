
export let requiredRules = [
  v => !!v || '内容不能为空'
]
export let phoneRules = [
  v => !!v || '电话号码不能为空',
  v => (v && v.length === 11) || '电话号码必须是11位'
]

export let emailRules = [
  v => !!v || '邮箱不能为空',
  v => /.+@.+\..+/.test(v) || '电子邮箱不规范'
]

export let passwordRules = [
  v => !!v || '密码不能为空',
  v => (v && v.length >= 8) || '密码不能少于8位'
]
export let codeRules = [
  v => !!v || '验证码不能为空',
  v => (v && v.length === 4) || '验证码是4位'
]
