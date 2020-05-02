import React from 'react';
import { connect } from 'react-redux';

import LanguageSelector from './language-selector';
import SpinnerButton from './spinner-button';

class SubmitForm extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(evt) {
    this.setState({
      parsingSentences: true,
    });

    this.props.onSubmit(evt);
  }

  render() {
    const {
      message,
      error,
      errorMessage,
      languages,
      allLanguages,
      sentenceSubmissionFailures,
    } = this.props;

    const {
      parsingSentences,
    } = this.state;

    const notError = !message && !error && !errorMessage;
    let extendedLanguages = languages.map((lang) => allLanguages.find((extendedLanguage) => extendedLanguage.code === lang));
    if (extendedLanguages.length < 1) {
      extendedLanguages = allLanguages;
    }

    return (
      <form id="add-form" onSubmit={this.onSubmit}>
        <h2>Add Sentences</h2>

        { message && (<section className="form-message">{ message }</section>)}
        { error && (<section className="form-error">{ error }</section>)}
        { errorMessage && (<section className="form-error">{ errorMessage }</section>)}

        { sentenceSubmissionFailures.length > 0 && (
          <section>
            <h3>Failed sentences:</h3>
            <ul>
              { sentenceSubmissionFailures.map((failure) => (
                <li key={failure.sentence}>{failure.sentence}: {failure.error.message}</li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <label className="language-selector-label" htmlFor="language-selector">
            Select Language
          </label>
          <LanguageSelector name="language-selector" languages={extendedLanguages}/>
        </section>
        <section>
          <label htmlFor="sentences-input">
            Add <a target="_blank" rel="noopener" href="https://en.wikipedia.org/wiki/Public_domain">public domain</a> sentences
          </label>
          <textarea id="sentences-input" placeholder="One sentence per line" />
        </section>
        <section>
          <label htmlFor="source-input">
            Where are these <a target="_blank" rel="noopener" href="https://en.wikipedia.org/wiki/Public_domain">public domain</a> sentences from?
          </label>
          <input id="source-input" type="text" placeholder="Read our How-to if unsure how to attribute" />
        </section>
        <section>
          <input id="agree" type="checkbox" />
          <label htmlFor="agree">
            I confirm that these sentences are {}
            <a target="_blank" rel="noopener" href="https://en.wikipedia.org/wiki/Public_domain">public domain</a> {}
            and I have permission to upload them.
          </label>
        </section>

        <section id="confirm-buttons" className="divCenter">
          { notError && parsingSentences ?
            <SpinnerButton></SpinnerButton> :
            <button>Submit</button>
          }

          { notError && parsingSentences && (
            <div>
              <p className="loadingText">Sentences are being validated. This can take a few seconds depending on the number of sentences added.</p>
            </div>
          )}
        </section>

      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    allLanguages: state.languages.allLanguages,
    languages: state.languages.languages,
    errorMessage: state.sentences.errorMessage,
    sentenceSubmissionFailures: state.sentences.sentenceSubmissionFailures,
  };
}

export default connect(mapStateToProps)(SubmitForm);