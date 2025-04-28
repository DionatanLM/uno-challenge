/**
 * Gera um ID incremental único para cada novo item.
 * @returns {number} Um número inteiro único.
 */
let currentId = 1000;
function generateRandomId() {
  return currentId++;
}

module.exports = generateRandomId;
