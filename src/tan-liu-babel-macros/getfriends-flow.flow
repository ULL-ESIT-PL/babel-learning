import idx from 'idx';

let props = { user: { friends: [{ friends: [] } ] }}

function getFriends() {
  return idx(props, _ => _.user.friends[0].friends);
}

console.log(getFriends())