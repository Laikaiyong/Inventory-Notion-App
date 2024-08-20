import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Platform, Modal, View } from "react-native";
import { Client } from "@notionhq/client";

import FloatingActionButton from "@/components/custom/FloatingButton";
import InventoryForm from "@/components/custom/Form";
import { Collapsible } from "@/components/Collapsible";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

// Initialize Notion client
const notion = new Client({ auth: process.env.EXPO_PUBLIC_NOTION_API_KEY });
const databaseId = process.env.EXPO_PUBLIC_NOTION_DATABASE_ID;

export default function HomeScreen() {
  const multiTags = [
      {
        color: "orange",
        id: "512182f9-79b1-4e16-84d7-83ec8895419a",
        name: "Cat's Parent",
      },
      {
        color: "gray",
        id: "6f566079-d286-450d-abf3-34959151dcea",
        name: "Asset",
      },
      {
        color: "purple",
        id: "8acfe167-67a0-408c-972c-9079ccc1da48",
        name: "Heavy",
      },
      {
        color: "red",
        id: "f1ea7c69-ac7e-4d25-a513-f6989338cc4c",
        name: "B40",
      },
      {
        color: "blue",
        id: "7de087d0-f979-4c03-afd9-b62bc4b8c15d",
        name: "Lion's Kid",
      },
  ]
  const [inventoryItems, setInventoryItems] = useState<
    | PageObjectResponse[]
    | (
        | PageObjectResponse
        | PartialPageObjectResponse
        | PartialDatabaseObjectResponse
        | DatabaseObjectResponse
      )[]
  >([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = async (item: any) => {
    try {
      await storeInNotion(item);
      setIsFormVisible(false);
      // You might want to update the local state or refetch the inventory here
    } catch (error) {
      // Handle error (e.g., show an error message to the user)
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await notion.databases.query({
        database_id: databaseId!,
      });
      // console.log(response.results[0].properties.Image);
      setInventoryItems(response.results);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  const storeInNotion = async (item: any) => {
    try {
      const response = await notion.pages.create({
          parent: { database_id: databaseId! },
          properties: {
            Name: {
              "id": "title",
              "type": "title",
              title: [
                {
                  "type": "text",
                  text: {
                    content: item.name,
                    link: null
                  },
                  "annotations": {
                    "bold": false,
                    "italic": false,
                    "strikethrough": false,
                    "underline": false,
                    "code": false,
                    "color": "default"
                  }
                },
              ],
            },
            Tags: {
              multi_select: item.tags.map((tag: any) => ({ name: tag })),
            },
            Quantity: {
              number: item.quantity,
            },
            Description: {
              rich_text: [
                {
                  text: {
                    content: item.description,
                  },
                },
              ],
            },
            Image: {
              files: [
                {
                  external: {
                    url: item.image,
                },
                name: `${item.name}.png`,
              },
            ],
            },
          },
        });

      if (!response) {
        throw new Error(response);
      }

      fetchInventoryItems();
    } catch (error) {
      console.error("Error storing item in Notion:", error);
      throw error;
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/inventory.png")}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Inventories</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        {inventoryItems.map((item) => (
          <Collapsible
            key={item.id}
            title={item.properties.Name.title[0].plain_text}>
            <ThemedText>Quantity: {item.properties.Quantity.number}</ThemedText>
            <ThemedText style={styles.description}>
              Description:{" "}
              {item.properties.Description.rich_text[0]?.plain_text ||
                "No description"}
            </ThemedText>
            <ThemedText style={styles.tagsTitle}>Tags:</ThemedText>
            {renderTags(item.properties.Tags.multi_select)}
          </Collapsible>
        ))}
      </ThemedView>
      <FloatingActionButton onPress={() => setIsFormVisible(true)} />

      <Modal
        visible={isFormVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFormVisible(false)}>
        <View style={styles.modalContainer}>
          <InventoryForm
            onSubmit={handleSubmit}
            onCancel={() => setIsFormVisible(false)}
          />
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  quantity: {
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  tagsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    color: "white",
    fontSize: 12,
  },
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

const renderTags = (tags: any) => {
  return (
    <ThemedView style={styles.tagContainer}>
      {tags.map((tag: any, index: number) => (
        <ThemedView key={index} style={styles.tag}>
          <ThemedText style={styles.tagText}>{tag.name}</ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
};
