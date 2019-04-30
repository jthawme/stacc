var exports = module.exports = {};

const isFlag = (text) => {
  return text.indexOf('-') === 0;
};
exports.isFlag = isFlag;

const matchArgument = (argument, _commands) => {
  const command = _commands.filter((c) => {
    return c.string.indexOf(argument) >= 0;
  });

  return command.length ? command[0] : false;
};
exports.matchArgument = matchArgument;

const parseArguments = (_commands) => {
  const args = process.argv.filter((a, i) => {
    return (i >= 2);
  });

  const parsedArgs = {};

  while (args.length) {
    const arg = args.splice(0, 1);

    const matchedArgument = matchArgument(arg[0], _commands);

    if (matchedArgument) {
      if (matchedArgument.params.length) {
        const params = [];
        matchedArgument.params.forEach((p, i) => {
          const nextArg = args[i];
          if (nextArg && !isFlag(nextArg)) {
            let cast;

            switch (p) {
            case 'string':
              cast = nextArg.toString();
              break;
            case 'int':
              cast = Number(nextArg);
              break;
            }

            if (matchedArgument.modify && matchedArgument.modify[i]) {
              cast = matchedArgument.modify[i](cast);
            }

            params.push(cast);
          }
        });

        if (params.length) {
          parsedArgs[matchedArgument.name] = matchedArgument.params.length === 1 ? params[0] : params;
        } else {
          console.error(`'${matchedArgument.name}' needs parameters passed to it`);
        }
      } else {
        parsedArgs[matchedArgument.name] = true;
      }
    }
  }

  return parsedArgs;
};
exports.parseArguments = parseArguments;

const formatCommand = (_command) => {
  let ret = '\n';

  let argCommand = 'Command: \t';
  _command.string.forEach((c) => {
    argCommand += c + ' ';
  });

  ret += argCommand + '\n';

  let paramCommand = 'Params: \t';
  if (_command.params.length === 0) {
    paramCommand += 'Boolean';
  } else {
    _command.params.forEach((p) => {
      paramCommand += p + ' ';
    });
  }

  ret += paramCommand + '\n';

  ret += 'Default: \t' + _command.default.toString() + '\n';

  if (_command.description) {
    ret += _command.description + '\n';
  }

  return ret + '\n' + '-----' + '\n';
};
exports.formatCommand = formatCommand;

const getDefaultArgs = (_commands) => {
  const defaults = {};

  _commands.forEach((c) => {
    defaults[c.name] = c.default || '';
  });

  return defaults;
};
exports.getDefaultArgs = getDefaultArgs;

const printCommands = (commands) => {
  let str = '';
  commands.forEach((c) => {
    str += formatCommand(c);
  });

  return str;
};
exports.printCommands = printCommands;
