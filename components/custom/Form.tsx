import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import MultiSelect from "react-native-multiple-select";

const InventoryForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: ({
    name,
    tags,
    quantity,
    description,
    image,
  }: {
    name: string;
    tags: object[];
    quantity: number;
    description: string;
    image: string;
  }) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState("");
  const [tags, setTags] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = () => {
    onSubmit({ name, tags, quantity: Number(quantity), description, image });
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <MultiSelect
        items={[
          {
            color: "orange",
            id: "Cat's Parent",
            name: "Cat's Parent",
          },
          {
            color: "gray",
            id: "Asset",
            name: "Asset",
          },
          {
            color: "purple",
            id: "Heavy",
            name: "Heavy",
          },
          {
            color: "red",
            id: "B40",
            name: "B40",
          },
          {
            color: "blue",
            id: "Lion's Kid",
            name: "Lion's Kid",
          },
        ]}
        uniqueKey="id"
        onSelectedItemsChange={setTags}
        selectedItems={tags}
        selectText="Select Tags"
        searchInputPlaceholderText="Search Tags..."
        tagRemoveIconColor="#000"
        tagBorderColor="#000"
        tagTextColor="#000"
        selectedItemTextColor="#000"
        selectedItemIconColor="#000"
        itemTextColor="#000"
        displayKey="name"
        searchInputStyle={{ color: "#000" }}
        submitButtonColor="#000"
        submitButtonText="Submit"
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
      />
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={onCancel} color="#FF3B30" />
        <Button title="Submit" onPress={handleSubmit} color="#007AFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default InventoryForm;
