"use client";
import { Condition } from "@/lib/constants";
import { QuestionBoxReread } from "@textbook/question/question-box-reread";
import { QuestionBoxSimple } from "@textbook/question/question-box-simple";
import { QuestionBoxStairs } from "@textbook/question/question-box-stairs";
import { useSelector } from "@xstate/store/react";
import { useCondition, useQuestionStore } from "../provider/page-provider";
import { User } from "@/drizzle/schema";

type Props = {
  question: string;
  answer: string;
  chunkSlug: string;
  pageSlug: string;
  user: User;
};

export const Question = ({
  question,
  answer,
  chunkSlug,
  pageSlug,
  user,
}: Props) => {
  const store = useQuestionStore();
  const condition = useCondition();
  const chunkStatus = useSelector(
    store,
    (store) => store.context.chunkStatus[chunkSlug]
  );
  console.log(user);

  if (!chunkStatus || !chunkStatus.hasQuestion) return null;

  return (
    <div className="question-container my-6">
      {condition === Condition.STAIRS && (
        <QuestionBoxStairs
          question={question}
          answer={answer}
          chunkSlug={chunkSlug}
          pageSlug={pageSlug}
        />
      )}
      {condition === Condition.RANDOM_REREAD && (
        <QuestionBoxReread
          question={question}
          answer={answer}
          chunkSlug={chunkSlug}
          pageSlug={pageSlug}
        />
      )}
      {condition === Condition.SIMPLE && (
        <QuestionBoxSimple
          question={question}
          answer={answer}
          chunkSlug={chunkSlug}
          pageSlug={pageSlug}
        />
      )}
    </div>
  );
};
