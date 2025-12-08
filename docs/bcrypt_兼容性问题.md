# 🔧 bcrypt 版本兼容性问题修复指南

## 问题描述

错误信息：
```
(trapped) error reading bcrypt version
AttributeError: module 'bcrypt' has no attribute '__about__'
```

## 问题原因

- **bcrypt 5.0.0** 版本移除了 `__about__` 属性
- **passlib 1.7.4** 尝试读取这个属性来检测 bcrypt 版本
- 两者不兼容，导致密码验证失败

## 解决方案

### 方法一：降级 bcrypt（推荐）

1. **停止后端服务**（如果正在运行）
   - 关闭后端服务的 PowerShell 窗口
   - 或按 `Ctrl+C` 停止

2. **安装兼容版本**
   ```powershell
   .\venv\Scripts\Activate.ps1
   pip install bcrypt==4.1.2 --force-reinstall
   ```

3. **验证安装**
   ```powershell
   python -c "from app.core.security import verify_password, get_password_hash; print('OK')"
   ```

4. **重新启动后端服务**

### 方法二：使用修复脚本

```powershell
python fix_bcrypt.py
```

脚本会引导你完成修复过程。

### 方法三：手动修复（如果遇到权限错误）

如果遇到 `[WinError 5] 拒绝访问` 错误：

1. **关闭所有后端服务窗口**

2. **以管理员身份打开 PowerShell**
   - 右键点击 PowerShell
   - 选择 "以管理员身份运行"

3. **切换到项目目录**
   ```powershell
   cd D:\competition\skytrip
   ```

4. **激活虚拟环境并安装**
   ```powershell
   .\venv\Scripts\Activate.ps1
   pip install bcrypt==4.1.2 --force-reinstall
   ```

## 验证修复

修复后，测试登录功能：

1. 启动后端服务
2. 访问前端：http://localhost:5173
3. 使用管理员账号登录：
   - 用户名：`admin`
   - 密码：`admin123`

如果登录成功，说明问题已解决。

## 预防措施

`requirements.txt` 已更新，指定了兼容的 bcrypt 版本：

```
bcrypt==4.1.2
```

以后重新安装依赖时，会自动使用正确的版本：

```powershell
pip install -r requirements.txt
```

## 相关文件

- `requirements.txt` - 已更新 bcrypt 版本
- `app/core/security.py` - 密码哈希和验证模块
- `fix_bcrypt.py` - 自动修复脚本

## 常见问题

### Q: 为什么不能直接升级 passlib？

A: passlib 1.7.4 已经是当前最新版本，没有更新的版本可用。

### Q: 可以使用其他密码哈希库吗？

A: 可以，但需要修改 `app/core/security.py`。bcrypt 是推荐的选择，只需要使用兼容版本即可。

### Q: 修复后还需要做什么？

A: 修复后需要重新启动后端服务，然后就可以正常登录了。

