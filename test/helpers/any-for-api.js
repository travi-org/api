const any = require('@travi/any');

any.resource = () => any.simpleObject();

any.resources = {
  ride() {
    return {
      id: any.integer(),
      nickname: any.string()
    };
  },
  person() {
    return {
      id: any.word(),
      'first-name': any.string(),
      'last-name': any.string(),
      email: any.email()
    };
  }
};

export default any;
