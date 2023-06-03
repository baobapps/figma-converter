import './environments';

export default () => {
  return 'Hello World!' + process.env.MY_SECRET;
};
