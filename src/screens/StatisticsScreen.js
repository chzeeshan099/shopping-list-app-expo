import React from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  CheckCircle2,
  DollarSign,
  Heart,
  List,
  ShoppingCart,
} from 'lucide-react-native';

import {
  useShopping,
} from '../context/ShoppingContext';

const StatisticsScreen = () => {
  const {
    allStats,
    allItems,
    lists,
  } = useShopping();

  const categories = [
    'Food',
    'Drinks',
    'Home',
    'Personal',
    'Other',
  ];

  const categoryStats =
    categories.map((category) => {
      const items =
        allItems.filter(
          (item) =>
            item.category ===
            category
        );

      const total = items.reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
            Number(item.quantity),
        0
      );

      return {
        category,
        total,
      };
    });

  const max =
    Math.max(
      ...categoryStats.map(
        (item) => item.total
      ),
      1
    );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <Text style={styles.kicker}>
        SHOPLIST ⚡
      </Text>

      <Text style={styles.title}>
        STATISTICS
      </Text>

      <Text style={styles.subtitle}>
        Your shopping activity.
      </Text>

      <View style={styles.grid}>
        <StatCard
          icon={<ShoppingCart size={20} color="#B6FF00" />}
          value={allStats.totalItems}
          label="TOTAL ITEMS"
        />

        <StatCard
          icon={<CheckCircle2 size={20} color="#B6FF00" />}
          value={allStats.completedItems}
          label="COMPLETED"
        />

        <StatCard
          icon={<List size={20} color="#B6FF00" />}
          value={allStats.totalLists}
          label="LISTS"
        />

        <StatCard
          icon={<Heart size={20} color="#FF6B9A" />}
          value={allStats.favoriteCount}
          label="FAVORITES"
        />
      </View>

      <View style={styles.moneyCard}>
        <View style={styles.moneyIcon}>
          <DollarSign
            size={23}
            color="#080808"
          />
        </View>

        <View>
          <Text style={styles.moneyLabel}>
            TOTAL SHOPPING VALUE
          </Text>

          <Text style={styles.moneyValue}>
            ${allStats.totalSpent.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          SPENDING BY CATEGORY
        </Text>

        {categoryStats.map(
          (item) => (
            <View
              key={item.category}
              style={styles.barRow}
            >
              <View
                style={styles.barHeader}
              >
                <Text
                  style={styles.categoryName}
                >
                  {item.category}
                </Text>

                <Text
                  style={styles.categoryValue}
                >
                  ${item.total.toFixed(2)}
                </Text>
              </View>

              <View
                style={styles.track}
              >
                <View
                  style={[
                    styles.bar,
                    {
                      width: `${
                        (item.total /
                          max) *
                        100
                      }%`,
                    },
                  ]}
                />
              </View>
            </View>
          )
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          YOUR LISTS
        </Text>

        {lists.map((list) => (
          <View
            key={list.id}
            style={styles.listRow}
          >
            <Text style={styles.listEmoji}>
              {list.emoji}
            </Text>

            <Text
              style={styles.listName}
            >
              {list.name}
            </Text>

            <Text
              style={styles.listBudget}
            >
              ${Number(list.budget).toFixed(0)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const StatCard = ({
  icon,
  value,
  label,
}) => (
  <View style={styles.statCard}>
    <View style={styles.statIcon}>
      {icon}
    </View>

    <Text style={styles.statValue}>
      {value}
    </Text>

    <Text style={styles.statLabel}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },

  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 50,
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
    marginTop: 4,
  },

  subtitle: {
    color: '#555',
    fontSize: 11,
    marginTop: 4,
    marginBottom: 22,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  statCard: {
    width: '48%',
    minHeight: 125,
    backgroundColor: '#151515',
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#292929',
    padding: 14,
  },

  statIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: '#202400',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statValue: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 12,
  },

  statLabel: {
    color: '#555',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 3,
  },

  moneyCard: {
    marginTop: 12,
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#B6FF00',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },

  moneyIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#D4FF66',
    alignItems: 'center',
    justifyContent: 'center',
  },

  moneyLabel: {
    color: '#3E4900',
    fontSize: 8,
    fontWeight: '900',
  },

  moneyValue: {
    color: '#080808',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 3,
  },

  section: {
    marginTop: 28,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.3,
    marginBottom: 14,
  },

  barRow: {
    marginBottom: 15,
  },

  barHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginBottom: 6,
  },

  categoryName: {
    color: '#888',
    fontSize: 10,
  },

  categoryValue: {
    color: '#B6FF00',
    fontSize: 10,
    fontWeight: '900',
  },

  track: {
    height: 7,
    borderRadius: 10,
    backgroundColor: '#1F1F1F',
    overflow: 'hidden',
  },

  bar: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#B6FF00',
  },

  listRow: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#292929',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 8,
  },

  listEmoji: {
    fontSize: 22,
    marginRight: 10,
  },

  listName: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  listBudget: {
    color: '#B6FF00',
    fontSize: 12,
    fontWeight: '900',
  },
});

export default StatisticsScreen;