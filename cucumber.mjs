const config = {
  default: {
    paths: ['features/**/*.feature'],
    require: [
      'ts-node/register',
      'features/step_definitions/**/*.ts'
    ],
    publishQuiet: true,
    format: ['progress-bar', 'html:reports/cucumber.html']
  }
};

export default config;
