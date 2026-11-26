# Kerberos SSO

Test [node-expose-sspi]

[node-expose-sspi]: https://github.com/jlguenego/node-expose-sspi

## SPN
```powershell
setspn -S HTTP/eka-vm-uxm00011.snr.tmk.group stanislav.ukolov

Get-ADUser stanislav.ukolov -Properties servicePrincipalName,userPrincipalName,msDS-KeyVersionNumber
```

## Browser
+ `HKLM\SOFTWARE\Policies\Google\Chrome`
+ `HKLM\SOFTWARE\Policies\YandexBrowser`
+ `HKLM\SOFTWARE\Policies\Microsoft\Edge`

`AuthServerAllowlist` = `*.tmk.group,*.ekb.ru,*.sinara-group.com`
