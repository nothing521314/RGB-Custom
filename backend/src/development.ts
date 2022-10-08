import t from './commands/develop'
import path from "path";

t({port: 9000, directory: path.join(__dirname, "..")})