import { Ui4Page } from './app.po';

describe('ui4 App', () => {
  let page: Ui4Page;

  beforeEach(() => {
    page = new Ui4Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
