module.exports = (temp, Data) => {
  let output = temp.replace(/##CYCLE_NAME##/g, Data.testCycle);
      output = output.replace(/##CYCLE_LINK##/g, Data.cyclelink);
      output = output.replace(/##BUG_TITLE##/g, Data.bugTitle);
      output = output.replace(/##BUG_LINK##/g, Data.bugLink);
      output = output.replace(/##BUG_STATUS##/g, Data.bugStatus);
  return output;
}