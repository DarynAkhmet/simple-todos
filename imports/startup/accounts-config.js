// отвечает за начальный вход в личный аккаунт
import { Accounts } from 'meteor/accounts-base';
 Accounts.ui.config ({
  passwordSignupFields: 'USERNAME_ONLY',
});
