我使用nodejs來測試前端功能，因此要開啟my-app的server.js需先做以下步驟  

下載nodejs(Windows)  

Step1.  

去https://nodejs.org 下載windows版本  

Step2.  

在cmd中輸入'node -v'和'npm -v'來檢查 Node.js 和 npm 是否正確安裝。如果安裝成功，你應該會看到它們的版本號  

下載nodejs(Ubuntu)  

Step1.  

sudo apt update  

Step2.  

sudo apt install nodejs npm  

下載nodejs完後  

Step3.  

在cmd(Windows)或terminal(Ubuntu)輸入'npm install express body-parser fs path cors nodemailer'  

Step4.  

在cmd(Windows)或terminal(Ubuntu)下進入my-app的目錄下，輸入'node server.js'，可成功開啟server端  

搭配vscode的live server便可使用