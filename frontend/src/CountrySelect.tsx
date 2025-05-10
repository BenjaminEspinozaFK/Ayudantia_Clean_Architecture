import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

type Country = { id: string; name: string };

export default function CountryTable() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [newCountry, setNewCountry] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  const fetchCountries = () => {
    axios.get("http://localhost:3000/countries").then((res) => {
      setCountries(res.data);
    });
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleAdd = async () => {
    if (!newCountry.trim()) return;
    await axios.post("http://localhost:3000/countries", { name: newCountry });
    setNewCountry("");
    fetchCountries();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:3000/countries/${id}`);
    fetchCountries();
  };

  const handleEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditedName(currentName);
  };

  const handleSave = async (id: string) => {
    if (!editedName.trim()) return;
    await axios.put(`http://localhost:3000/countries/${id}`, {
      name: editedName,
    });
    setEditingId(null);
    setEditedName("");
    fetchCountries();
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedName("");
  };

  const columns = [
    {
      name: "ID",
      selector: (row: Country) => row.id,
      sortable: true,
      width: "100px",
    },
    {
      name: "Nombre",
      cell: (row: Country) =>
        editingId === row.id ? (
          <input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
        ) : (
          row.name
        ),
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row: Country) =>
        editingId === row.id ? (
          <>
            <button onClick={() => handleSave(row.id)}>Guardar</button>
            <button onClick={handleCancel}>Cancelar</button>
          </>
        ) : (
          <>
            <button onClick={() => handleEdit(row.id, row.name)}>Editar</button>
            <button onClick={() => handleDelete(row.id)}>Eliminar</button>
          </>
        ),
    },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Lista de Países</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          value={newCountry}
          onChange={(e) => setNewCountry(e.target.value)}
          placeholder="Nuevo país"
        />
        <button onClick={handleAdd}>Agregar</button>
      </div>

      <DataTable
        columns={columns}
        data={countries}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No hay países registrados"
      />
    </div>
  );
}
