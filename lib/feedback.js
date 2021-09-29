var translations = require("./feedbackTranslations");
var feedback, scoring;

scoring = require("./scoring");

feedback = {
  default_feedback: {
    warning: "",
    suggestions: [translations.t1, translations.t2],
  },
  get_feedback: function (score, sequence) {
    var extra_feedback, i, len, longest_match, match, ref;
    if (sequence.length === 0) {
      return this.default_feedback;
    }
    if (score > 2) {
      return {
        warning: "",
        suggestions: [],
      };
    }
    longest_match = sequence[0];
    ref = sequence.slice(1);
    for (i = 0, len = ref.length; i < len; i++) {
      match = ref[i];
      if (match.token.length > longest_match.token.length) {
        longest_match = match;
      }
    }
    feedback = this.get_match_feedback(longest_match, sequence.length === 1);
    extra_feedback = translations.t3;
    if (feedback != null) {
      feedback.suggestions.unshift(extra_feedback);
      if (feedback.warning == null) {
        feedback.warning = "";
      }
    } else {
      feedback = {
        warning: "",
        suggestions: [extra_feedback],
      };
    }
    return feedback;
  },
  get_match_feedback: function (match, is_sole_match) {
    var layout, warning;
    switch (match.pattern) {
      case "dictionary":
        return this.get_dictionary_match_feedback(match, is_sole_match);
      case "spatial":
        layout = match.graph.toUpperCase();
        warning = match.turns === 1 ? translations.t4 : translations.t5;
        return {
          warning: warning,
          suggestions: [translations.t6],
        };
      case "repeat":
        warning = match.base_token.length === 1 ? translations.t7 : translations.t8;
        return {
          warning: warning,
          suggestions: [translations.t9],
        };
      case "sequence":
        return {
          warning: translations.t10,
          suggestions: [translations.t11],
        };
      case "regex":
        if (match.regex_name === "recent_year") {
          return {
            warning: translations.t12,
            suggestions: [translations.t13, translations.t14],
          };
        }
        break;
      case "date":
        return {
          warning: translations.t15,
          suggestions: [translations.t16],
        };
    }
  },
  get_dictionary_match_feedback: function (match, is_sole_match) {
    var ref, result, suggestions, warning, word;
    warning =
      match.dictionary_name === "passwords"
        ? is_sole_match && !match.l33t && !match.reversed
          ? match.rank <= 10
            ? translations.t17
            : match.rank <= 100
            ? translations.t18
            : translations.t19
          : match.guesses_log10 <= 4
          ? translations.t20
          : void 0
        : match.dictionary_name === "english_wikipedia"
        ? is_sole_match
          ? translations.t21
          : void 0
        : (ref = match.dictionary_name) === "surnames" || ref === "male_names" || ref === "female_names"
        ? is_sole_match
          ? translations.t22
          : translations.t23
        : "";
    suggestions = [];
    word = match.token;
    if (word.match(scoring.START_UPPER)) {
      suggestions.push(translations.t24);
    } else if (word.match(scoring.ALL_UPPER) && word.toLowerCase() !== word) {
      suggestions.push(translations.t25);
    }
    if (match.reversed && match.token.length >= 4) {
      suggestions.push(translations.t26);
    }
    if (match.l33t) {
      suggestions.push(translations.t27);
    }
    result = {
      warning: warning,
      suggestions: suggestions,
    };
    return result;
  },
};

module.exports = feedback;

//# sourceMappingURL=feedback.js.map
