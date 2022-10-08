import t from './commands/migrate'
import path from "path";

t({ directory: path.join(__dirname + '/loaders'), args: process.argv})