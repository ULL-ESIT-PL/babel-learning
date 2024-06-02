// https://youtu.be/5z28bsbJJ3w?si=7UMZyXpNG5AdfWCE Manipulating AST with JavaScript by Tan Liu Hau
import { t } from 'i18n';

function App() {
  console.log(t('Hello world!'));
}

const str = t('Bye! Nice to meet you!');
alert(str);