import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Input, Space, message } from "antd";
import type { ColumnsType } from "antd/lib/table";

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
    if (!newCountry.trim()) {
      message.warning("Country name cannot be empty.");
      return;
    }
    try {
      await axios.post("http://localhost:3000/countries", { name: newCountry });
      setNewCountry("");
      fetchCountries();
      message.success("País agregado");
    } catch (error: any) {
      console.error("Error adding country:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to add country.";
      message.error(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/countries/${id}`);
      fetchCountries();
      message.success("País eliminado");
    } catch (error: any) {
      console.error("Error deleting country:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to delete country.";
      message.error(errorMessage);
    }
  };

  const handleEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditedName(currentName);
  };

  const handleSave = async (id: string) => {
    if (!editedName.trim()) {
      message.warning("Country name cannot be empty.");
      return;
    }
    try {
      await axios.put(`http://localhost:3000/countries/${id}`, {
        name: editedName,
      });
      setEditingId(null);
      setEditedName("");
      fetchCountries();
      message.success("País actualizado");
    } catch (error: any) {
      console.error("Error updating country:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to update country.";
      message.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedName("");
  };

  const columns: ColumnsType<Country> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      render: (_text, row) =>
        editingId === row.id ? (
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            size="small"
          />
        ) : (
          row.name
        ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_text, row) =>
        editingId === row.id ? (
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => handleSave(row.id)}
            >
              Guardar
            </Button>
            <Button size="small" onClick={handleCancel}>
              Cancelar
            </Button>
          </Space>
        ) : (
          <Space>
            <Button size="small" onClick={() => handleEdit(row.id, row.name)}>
              Editar
            </Button>
            <Button danger size="small" onClick={() => handleDelete(row.id)}>
              Eliminar
            </Button>
          </Space>
        ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Lista de Países</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          value={newCountry}
          onChange={(e) => setNewCountry(e.target.value)}
          placeholder="Nuevo país"
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={handleAdd}>
          Agregar
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={countries}
        rowKey="id"
        pagination={{ pageSize: 8 }}
        locale={{ emptyText: "No hay países registrados" }}
      />
    </div>
  );
}
