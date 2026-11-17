const API_URL = 'http://localhost:4000/api/tasks';

async function parse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export async function getTasks() {
  const res = await fetch(API_URL);
  return parse(res);
}

export async function createTask(task) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  return parse(res);
}

export async function updateTask(id, updates) {
  const res = await fetch(API_URL + '/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return parse(res);
}

export async function deleteTask(id) {
  const res = await fetch(API_URL + '/' + id, {
    method: 'DELETE'
  });
  return parse(res);
}

export async function toggleTask(id) {
  const res = await fetch(API_URL + '/' + id + '/toggle', {
    method: 'PATCH'
  });
  return parse(res);
}
