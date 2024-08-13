import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Platform } from 'react-native';
import { Client } from '@notionhq/client';

import { HelloWave } from '@/components/HelloWave';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DatabaseObjectResponse, PageObjectResponse, PartialDatabaseObjectResponse, PartialPageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

// Initialize Notion client
const notion = new Client({ auth: process.env.EXPO_PUBLIC_NOTION_API_KEY });
const databaseId = process.env.EXPO_PUBLIC_NOTION_DATABASE_ID;

export default function HomeScreen() {
  const [inventoryItems, setInventoryItems] = useState<PageObjectResponse[] | (PageObjectResponse | PartialPageObjectResponse | PartialDatabaseObjectResponse | DatabaseObjectResponse)[]>([]);

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await notion.databases.query({ database_id: databaseId! });
      setInventoryItems(response.results);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/inventory.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Inventories</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        {inventoryItems.map((item) => (
          <Collapsible key={item.id} title={item.properties.Name.title[0].plain_text}>
            <ThemedText>Quantity: {item.properties.Quantity.number}</ThemedText>
            <ThemedText style={styles.description}>
            Description: {item.properties.Description.rich_text[0]?.plain_text || 'No description'}
          </ThemedText>
          <ThemedText style={styles.tagsTitle}>Tags:</ThemedText>
          {renderTags(item.properties.Tags.multi_select)}
          </Collapsible>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    position: 'absolute',
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
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
  },
});

const renderTags = (tags) => {
  return (
    <ThemedView style={styles.tagContainer}>
      {tags.map((tag, index) => (
        <ThemedView key={index} style={styles.tag}>
          <ThemedText style={styles.tagText}>{tag.name}</ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
};