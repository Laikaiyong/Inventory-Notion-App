import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlatList, Dimensions, StyleSheet, Image } from "react-native";
import { Client } from "@notionhq/client";
import Constants from "expo-constants";

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

const Item = ({ item }: any) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  return (
    <ThemedView
      style={{
        margin: 10,
      }}>
      <Image
        resizeMode={"cover"}
        style={{
          width: windowWidth / 3 - 40,
          height: windowHeight / 7,
        }}
        source={{
          uri:
            item.properties.Image.files[0]?.external.url,
        }}
      />
    </ThemedView>
  );
};

export default function TabTwoScreen() {
  const [inventoryItems, setInventoryItems] = useState<
    | PageObjectResponse[]
    | (
        | PageObjectResponse
        | PartialPageObjectResponse
        | PartialDatabaseObjectResponse
        | DatabaseObjectResponse
      )[]
  >([]);

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await notion.databases.query({
        database_id: databaseId!,
        filter: {
          property: "Image",
          files: {
            is_not_empty: true,
          },
        },
      });
      setInventoryItems(response.results);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={require("@/assets/images/gallery.png")}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Gallery</ThemedText>
      </ThemedView>
      <ThemedText>Inventory Images</ThemedText>
      <ThemedView>
        <FlatList
          data={inventoryItems}
          numColumns={3}
          scrollEnabled={false}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item.id}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  item: {
    flex: 1,
    maxWidth: "33%",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(249, 180, 45, 0.25)",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
});
