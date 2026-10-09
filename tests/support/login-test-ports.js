'use strict';
// Keep the default CI ports, but move every auxiliary server with the main
// account-test port so independent worktrees never contact each other's data.
function port(defaultPort) {
  return defaultPort + Number(process.env.LOGIN_TEST_PORT || 4181) - 4181;
}
function origin(defaultPort) { return 'http://127.0.0.1:' + port(defaultPort); }
module.exports = { port, origin };
