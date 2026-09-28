import React, {
  useState,
} from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Download,
  FileJson,
  Share2,
} from 'lucide-react-native';

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import {
  useShopping,
} from '../context/ShoppingContext';

const BackupScreen = () => {
  const {
    getBackupData,
    activeList,
    items,
    stats,
  } = useShopping();

  const [busy, setBusy] =
    useState(false);

  const shareList = async () => {
    try {
      const lines = items.map(
        (item) => {
          const check =
            item.purchased
              ? '✓'
              : '☐';

          const total =
            Number(item.price) *
            Number(item.quantity);

          return `${check} ${item.name} × ${item.quantity} — $${total.toFixed(
            2
          )}`;
        }
      );

      const message = [
        `${activeList?.emoji || '🛒'} ${
          activeList?.name ||
          'Shopping List'
        }`,
        '',
        ...lines,
        '',
        `TOTAL: $${stats.totalCost.toFixed(
          2
        )}`,
      ].join('\n');

      await navigator.share?.({
        title:
          'My Shopping List',
        text: message,
      });

      if (!navigator.share) {
        Alert.alert(
          'Shopping List',
          message
        );
      }
    } catch (error) {
      console.log(
        'Share error:',
        error
      );
    }
  };

  const exportJSON = async () => {
    try {
      setBusy(true);

      const data =
        JSON.stringify(
          getBackupData(),
          null,
          2
        );

      const fileUri =
        `${FileSystem.cacheDirectory}shoplist-backup-${Date.now()}.json`;

      await FileSystem.writeAsStringAsync(
        fileUri,
        data
      );

      const available =
        await Sharing.isAvailableAsync();

      if (available) {
        await Sharing.shareAsync(
          fileUri,
          {
            mimeType:
              'application/json',
            dialogTitle:
              'Export ShopList Backup',
          }
        );
      } else {
        Alert.alert(
          'Backup Created',
          `Backup saved locally:\n${fileUri}`
        );
      }
    } catch (error) {
      console.log(
        'Export error:',
        error
      );

      Alert.alert(
        'Export Failed',
        'Could not create the backup file.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>
        DATA CENTER ⚡
      </Text>

      <Text style={styles.title}>
        BACKUP
      </Text>

      <Text style={styles.subtitle}>
        Your data stays on your device.
      </Text>

      <Pressable
        onPress={shareList}
        style={styles.card}
      >
        <View style={styles.icon}>
          <Share2
            size={22}
            color="#B6FF00"
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>
            Share Shopping List
          </Text>

          <Text style={styles.description}>
            Send your current list to another app.
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={exportJSON}
        disabled={busy}
        style={styles.card}
      >
        <View style={styles.icon}>
          <FileJson
            size={22}
            color="#B6FF00"
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>
            Export Backup
          </Text>

          <Text style={styles.description}>
            Create a complete JSON backup of your data.
          </Text>
        </View>

        <Download
          size={18}
          color="#666"
        />
      </Pressable>

      {busy && (
        <Text style={styles.loading}>
          Preparing backup...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    padding: 20,
    paddingTop: 60,
  },

  kicker: {
    color: '#B6FF00',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color: '#555',
    fontSize: 11,
    marginTop: 4,
    marginBottom: 25,
  },

  card: {
    minHeight: 88,
    borderRadius: 22,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#292929',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  icon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#202500',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  info: {
    flex: 1,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  description: {
    color: '#5F5F5F',
    fontSize: 10,
    marginTop: 5,
    lineHeight: 15,
  },

  loading: {
    color: '#B6FF00',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 15,
  },
});

export default BackupScreen;