const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "TITRE", uid: "title"},
  {name: "PRENOM CREATEUR", uid: "creator_id.first_name", sortable: true},
  {name: "NOM CREATEUR", uid: "creator.last_name", sortable: true},
  {name: "CREATEUR", uid: "creator_id"},
  {name: "AFFICHÉ", uid: "to_display"},
  {name: "ACTIONS", uid: "actions"},
];

export { columns };