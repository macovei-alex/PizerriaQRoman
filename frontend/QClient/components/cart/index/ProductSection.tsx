import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CartItem, useCartContext } from "@/context/useCartContext";
import CartItemCard from "./CartItemCard";
import useColorTheme from "@/hooks/useColorTheme";
import logger from "@/utils/logger";

function calculatePrice(item: CartItem) {
  let price = item.product.price;
  for (const [optionListId, optionList] of Object.entries(item.options)) {
    for (const [optionId, optionCount] of Object.entries(optionList)) {
      const list = item.product.optionLists.find((list) => list.id === Number(optionListId));
      if (!list) {
        throw new Error(`Option list not found: ${optionListId}`);
      }
      const option = list.options.find((option) => option.id === Number(optionId));
      if (!option) {
        throw new Error(`Option not found: ${optionId}`);
      }

      price += option.price * optionCount;
    }
  }
  return price * item.count;
}

export default function ProductSection() {
  logger.render("ProductSection");

  const colorTheme = useColorTheme();
  const { cart } = useCartContext();

  const prices = cart.map((cartItem) => calculatePrice(cartItem));
  const totalPrice = prices.reduce((acc, price) => acc + price, 0);

  return (
    <>
      {cart.map((cartItem, index) => (
        <CartItemCard key={cartItem.id} cartItem={cartItem} price={prices[index]} />
      ))}
      <View style={styles.totalPriceContainerContainer}>
        <View style={[styles.totalPriceContainer, { backgroundColor: colorTheme.background.accent }]}>
          <Text style={[styles.totalPriceText, { color: colorTheme.text.onAccent }]}>
            Total de plată: {totalPrice.toFixed(2)} RON
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  totalPriceContainerContainer: {
    alignItems: "center",
  },
  totalPriceContainer: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 18,
  },
  totalPriceText: {
    fontSize: 17,
    fontWeight: "bold",
  },
});
