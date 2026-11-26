# Kerberos SSO

Test [node-expose-sspi]

[node-expose-sspi]: https://github.com/jlguenego/node-expose-sspi

## SPN
```powershell
setspn -S HTTP/eka-vm-uxm00011.snr.tmk.group stanislav.ukolov

get-aduser stanislav.ukolov -Properties servicePrincipalName,userPrincipalName,msDS-KeyVersionNumber
```
