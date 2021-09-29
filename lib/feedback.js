var translations = require("./feedbackTranslations");
var feedback, scoring;

scoring = require("./scoring");

feedback = {
  default_feedback: {
    warning: "",
    suggestions: [translations.s1, translations.s2],
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
    extra_feedback = translations.s3;
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
        return {
          warning: translations.w5,
          suggestions: [translations.s6],
        };
      case "repeat":
        return {
          warning: translations.w7,
          suggestions: [],
        };
      case "sequence":
        return {
          warning: translations.w10,
          suggestions: [],
        };
      case "regex":
        if (match.regex_name === "recent_year") {
          return {
            warning: "",
            suggestions: [translations.s16],
          };
        }
        break;
      case "date":
        return {
          warning: "",
          suggestions: [translations.s16],
        };
    }
  },
  get_dictionary_match_feedback: function (match, is_sole_match) {
    var ref, result, suggestions, warning, word;
    warning =
      match.dictionary_name === "passwords"
        ? is_sole_match && !match.l33t && !match.reversed
          ? translations.w19
          : match.guesses_log10 <= 4
          ? translations.w20
          : ""
        : match.dictionary_name === "english_wikipedia"
        ? is_sole_match
          ? translations.w21
          : ""
        : (ref = match.dictionary_name) === "surnames" || ref === "male_names" || ref === "female_names"
        ? translations.w23
        : "";
    suggestions = [];
    word = match.token;
    if (word.match(scoring.START_UPPER)) {
      suggestions.push(translations.s24);
    } else if (word.match(scoring.ALL_UPPER) && word.toLowerCase() !== word) {
      suggestions.push(translations.s24);
    }
    if (match.reversed && match.token.length >= 4) {
      suggestions.push(translations.s26);
    }
    if (match.l33t) {
      suggestions.push(translations.s27);
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
