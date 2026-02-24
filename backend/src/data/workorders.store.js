const workorders = new Map();

function list() {
  return Array.from(workorders.values());
}

function getById(id) {
  return workorders.get(id) || null;
}

function save(item) {
  workorders.set(item.id, item);
  return item;
}

function remove(id) {
  return workorders.delete(id);
}

function clear() {
  workorders.clear();
}

module.exports = {
  list,
  getById,
  save,
  remove,
  clear,
};
