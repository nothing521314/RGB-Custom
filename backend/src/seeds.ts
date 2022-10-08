import t from './commands/seed'
import path from "path";

const args = process.argv;
args.shift()
args.shift()

t({ directory: path.join(__dirname + '/loaders'), migrate: true, seedFile: args[0]})