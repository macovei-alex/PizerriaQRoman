import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LayoutChangeEvent, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import useScrollRef from "@/hooks/useScrollRef";
import LogoSection from "@/components/menu/index/LogoSection";
import HorizontalCategorySection from "@/components/menu/index/HorizontalCategorySection";
import VerticalCategorySection from "@/components/menu/index/VerticalCategorySection";
import useImages from "@/hooks/useImages";
import useProductsQuery from "@/hooks/useProductsQuery";
import useCategoriesQuery from "@/hooks/useCategoriesQuery";
import { Category, CategoryId } from "@/api/types/Category";
import { Product } from "@/api/types/Product";
import logger from "@/utils/logger";
import MenuSkeletonLoader from "@/components/menu/index/MenuSkeletonLoader";
import useColorTheme from "@/hooks/useColorTheme";
import GoBackButtonSvg from "@/components/svg/GoBackButtonSvg";

type ProductSplit = {
  category: Category;
  products: Product[];
};

export default function Menu() {
  logger.render("Menu");

  const colorTheme = useColorTheme();
  const { scrollRef, scrollToPos } = useScrollRef();
  const [categoryPositions, setCategoryPositions] = useState<Record<CategoryId, number>>({});

  const productQuery = useProductsQuery();
  const categoryQuery = useCategoriesQuery();

  const imageNames = useMemo(
    () => productQuery.data?.map((product) => product.imageName) || [],
    [productQuery.data]
  );
  const images = useImages(imageNames);

  // Save the position of each category for the scroll to position from the horizontal menu
  function updateCategoryLayoutPosition(categoryId: CategoryId, event: LayoutChangeEvent) {
    // Extracting data in layout is a MUST because the event is a synthetic event (event pooling)
    // and event.nativeEvent will be set to null afterwards.
    const { layout } = event.nativeEvent;
    setCategoryPositions((prevPositions) => {
      return { ...prevPositions, [categoryId]: layout.y };
    });
  }

  function scrollToCategoryId(categoryId: CategoryId) {
    const pos = categoryPositions[categoryId];
    if (pos) {
      scrollToPos({ y: pos });
    }
  }

  // Split products by category
  const productsPerCategory = useMemo(() => {
    if (!productQuery.data || !categoryQuery.data) {
      return [];
    }

    const productsSplit: ProductSplit[] = [];
    for (const category of categoryQuery.data) {
      const newProductSplit: ProductSplit = { category: category, products: [] };
      for (const product of productQuery.data) {
        if (product.categoryId === category.id) {
          newProductSplit.products.push(product);
        }
      }
      productsSplit.push(newProductSplit);
    }
    return productsSplit;
  }, [productQuery.data, categoryQuery.data]);

  if (productQuery.isLoading || categoryQuery.isLoading || !images || images.length === 0) {
    return <MenuSkeletonLoader />;
  }
  if (productQuery.isError) {
    return <Text>Error: {productQuery.error.message}</Text>;
  }
  if (categoryQuery.isError) {
    return <Text>Error: {categoryQuery.error.message}</Text>;
  }

  return (
    <SafeAreaView style={{ backgroundColor: colorTheme.background.primary }}>
      <ScrollView ref={scrollRef}>
        <LogoSection />

        {/* For testing purposes */}
        <TouchableOpacity
          style={{ position: "absolute", top: 20, left: 20 }}
          onPress={() => router.push("/menu/test-loading")}
        >
          <GoBackButtonSvg style={{ width: 38, height: 38 }} />
        </TouchableOpacity>

        <HorizontalCategorySection
          categories={categoryQuery.data as Category[]}
          onCategoryPress={scrollToCategoryId}
        />

        <View>
          {productsPerCategory.map(({ category, products }) => (
            <VerticalCategorySection
              key={category.id}
              category={category}
              products={products}
              productImages={images}
              onLayout={updateCategoryLayoutPosition}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
