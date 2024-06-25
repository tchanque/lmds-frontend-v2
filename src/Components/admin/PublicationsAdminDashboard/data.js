const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "TITLE", uid: "title"},
  {name: "CREATOR FIRST NAME", uid: "creator_id.first_name", sortable: true},
  {name: "CREATOR LAST NAME", uid: "creator.last_name", sortable: true},
  {name: "CREATOR ID", uid: "creator_id"},
  {name: "DISPLAY", uid: "to_display"},
  {name: "ACTIONS", uid: "actions"},
];

export { columns };