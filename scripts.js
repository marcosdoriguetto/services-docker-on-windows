const Shell = require('node-powershell')

const getValueCheckBox = () => document.querySelector('#restart').checked;

function activeResource() {
  const valueCheckBox = getValueCheckBox();

  runAsAdmin(`"${linuxActive}; ${machineActive}; ${hyperActive}; ${valueCheckBox && restartComputer}"`);
}

function disableResource() {
  const valueCheckBox = getValueCheckBox();

  runAsAdmin(`"${linuxDisable}; ${machineDisable}; ${hyperDisable};${valueCheckBox && restartComputer}"`);
}

const runAsAdmin = async (command) => {
  const usePowerShell = typeof command === 'string';
  const shell = new Shell({});
  await shell.addCommand('Start-Process');

  if (usePowerShell) await shell.addArgument('PowerShell');
  await shell.addArgument('-Verb');
  await shell.addArgument('RunAs');
  await shell.addArgument('-PassThru');
  if (usePowerShell) await shell.addArgument('-Wait');

  if (usePowerShell) {
    await shell.addArgument('-ArgumentList');
    await shell.addArgument(command);
  };

  await shell.invoke();
  return await shell.dispose();
}

const hyperActive = "dism.exe /online /enable-feature /featurename:Microsoft-Hyper-V /all /norestart";
const linuxActive = "dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart";
const machineActive = "dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart";
const linuxDisable = "dism.exe /online /disable-feature /featurename:Microsoft-Windows-Subsystem-Linux /norestart";
const machineDisable = "dism.exe /online /disable-feature /featurename:VirtualMachinePlatform /norestart";
const hyperDisable = "dism.exe /online /disable-feature /featurename:Microsoft-Hyper-V /norestart";

const restartComputer = "shutdown /r -t 0";

const buttonActive = document.querySelector('.active');
buttonActive.onclick = () => activeResource();
const buttonDisable = document.querySelector('.disable');
buttonDisable.onclick = () => disableResource();

