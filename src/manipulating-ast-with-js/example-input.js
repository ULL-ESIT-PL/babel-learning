// https://youtu.be/5z28bsbJJ3w?si=7UMZyXpNG5AdfWCE Manipulating AST with JavaScript by Tan Liu Hau
import { t } from 'i18n';

function App() {
  console.log(t('label_hello'));
}

const str = t('label_bye');
alert(str);