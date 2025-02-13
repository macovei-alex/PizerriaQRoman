import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import useColorTheme from "@/hooks/useColorTheme";
import { OptionId, OptionList } from "@/api/types/Product";
import OptionCard from "./OptionCard";
import logger from "@/utils/logger";

type OptionListProps = {
  optionList: OptionList;
};

export default function OptionListCard({ optionList }: OptionListProps) {
  logger.render("OptionListCard");

  const colorTheme = useColorTheme();
  const [selectedOptions, setSelectedOptions] = useState<OptionId[]>([]);

  function handleOptionPress(optionId: OptionId) {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      if (selectedOptions.length < optionList.maxChoices) {
        setSelectedOptions([...selectedOptions, optionId]);
      } else if (optionList.maxChoices === 1) {
        setSelectedOptions([optionId]);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.titleText, { color: colorTheme.text.primary }]}>{optionList.text}</Text>
      {optionList.options.map((option) => (
        <OptionCard
          key={option.id}
          option={option}
          checked={selectedOptions.includes(option.id)}
          customOnPress={handleOptionPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
  },
  titleText: {
    fontStyle: "italic",
    fontSize: 22,
    marginBottom: 12,
  },
});
