import {mapToResponse} from '../../../lib/api/error-response-mapper';

require('setup-referee-sinon/globals');

suite('error response mapper', () => {
  const type = sinon.stub();
  const code = sinon.stub();
  const responseApi = {code, type};
  const reply = sinon.stub().returns(responseApi);
  const NOT_FOUND = 404;
  const SERVER_ERROR = 500;
  code.returns(responseApi);
  type.returns(responseApi);

  teardown(() => {
    code.reset();
    type.reset();
  });

  test('that vnd.error spec met', () => {
    mapToResponse({}, reply);

    assert.calledWith(reply, sinon.match({
      _links: {
        profile: {
          href: 'http://nocarrier.co.uk/profiles/vnd.error/'
        }
      }
    }));
    assert.calledWith(type, 'application/hal+json; profile="http://nocarrier.co.uk/profiles/vnd.error/"');
  });

  suite('unknown error', () => {
    test('that status is set to 500', () => {
      mapToResponse({}, reply);

      assert.calledWith(code, SERVER_ERROR);
      assert.calledWith(reply, sinon.match({message: 'Server Error'}));
    });
  });

  suite('not found error', () => {
    test('that status is set to 404', () => {
      mapToResponse({
        notFound: true
      }, reply);

      assert.calledWith(code, NOT_FOUND);
      assert.calledWith(reply, sinon.match({message: 'Not Found'}));
    });
  });
});
