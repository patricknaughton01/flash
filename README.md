</html>
  <head>
    <link rel="stylesheet" href="../js/chosen/chosen.css"/>
    <link rel="stylesheet" href="../css/bootstrap/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="../css/options.css"/>
  </head>
  <body>
    <div id="toc">
      <strong>Table of Contents</strong>
      <ul id="toc-list">
      </ul>
    </div>
    <div id="jellyContent">
      <h1 id="title">Jelly</h1>
      <div id="jellyExplanation">
        <h2 id="how-it-works">How It Works</h2>
        <hr/>
        <p>
          Jelly is a Chrome extension that makes it easier to make flash cards
          using Quizlet or Anki. To initiate making a card, simply highlight any word
          on a web page and click the icon that shows up. This will put whatever you
          highlighted into the term field of a new flash card and place your cursor
          into the answer field. You can then either type the answer, or simply highlight
          something else on the page to place in the answer field. Clicking save will
          save the card to the program you have chosen.
        </p>
        <h2 id="settings">Settings</h2>
        <hr/>
        <h3 id="activation-key">Activation Key</h3>
        <p>
          This option is off by default. Setting it equal to a key will caus the Jelly
          icon not to show up whenever you highlight a piece of text. Pressing
          Ctrl+Alt+Key where Key is the letter you have chosen will cause the icon
          to appear, at which point you can click it to create a card like normal.
        </p>
        <h3 id="highlight-answer">Highlight Answer</h3>
        <p>
          Checking this option will allow you to highlight additional text after you
          have initiated the creation of a card to place in the answer field. If it is
          disabled highlighting text after you started creating a card will close your
          current card and cause the Jelly icon to appear next to the new text you highlighted
          to create a different card.
        </p>
        <h3 id="auto-translate">Auto Translate</h3>
        <p>
          Turning this option on will cause Jelly to try to translate whatever text
          you highlight and place that text in the answer field (set by the Focus Index). The source and target
          languages can be configured in the popup.
        </p>
        <h3 id="picture-terms">Picture Terms</h3>
        <p>
          This setting currently does nothing. In a future release it will allow
          you to take a screenshot to initiate the creation of a flash card.
        </p>
        <h3 id="audio-terms">Audio Terms</h3>
        <p>
          This setting currently does nothing. In a future release it will allow
          you to record audio to initiate the creation of a flash card.
        </p>
        <h3 id="visibility-toggle">Visibility Toggle</h3>
        <p>
          If you are currently editing a card, pressing Ctrl+Alt+Key will cause the
          card to go invisible and releasing it will bring the card back. This allows
          you to see and highlight text it would otherwise cover.
        </p>
        <h3 id="source-language">Source Language</h3>
        <p>
          This is the language Jelly will try to translate from if Auto Translate
          is on. Set it to "Auto" to try to detect the language.
        </p>
        <h3 id="target-language">Target Language</h3>
        <p>
          This is the language Jelly will try to translate to if Auto Translate is on.
        </p>
        <h3 id="highlight-index">Highlight Index</h3>
        <p>
          This is the number of the field that Jelly will place the highlighted
          text into. So if it is 1, Jelly will try to place the highlighted text into
          the first field. If the number chosen is too high, Jelly will default
          to the first field.
        </p>
        <h3 id="focus-index">Focus Index</h3>
        <p>
          This is the number of the field that Jelly will place your cursor in when
          creating a new card. If it is too high, Jelly will default to the last
          field. This is also where the translated text will go if you have Auto
          Translate on.
        </p>
        <h3 id="flash-card-program">Flash Card Program</h3>
        <p>
          This determines which flash card program the card will be saved to.
          Currently only Anki and Quizlet are supported.
        </p>
        <h2 id="card-creation">Card Creation</h2>
        <hr/>
        <h3 id="anki">Anki</h3>
        <p>
          When creating an Anki card, you can select what deck to save it to and what
          model, or note type, you will use with the drop down menus. You can also
          create a new deck using the New Deck button.
        </p>
        <h3 id="quizlet">Quizlet</h3>
        <p>
          When creating a Quizlet card, you can select what set to save it to using
          the drop down menu. You can also create a new set using the New Set button.
        </p>
      </div>
    </div>
    <div id="flash-card-program-select-box">
      <div id="jellyCardProgramSelectBox">
        <strong>Flash card program:</strong>
        <select id="jellyCardProgramSelect">
          <option value="none">None</option>
          <option value="anki">Anki</option>
          <option value="quizlet">Quizlet</option>
        </select>
      </div>
      <div id="jellyAnkiConfig" class="jellyConfigBox" style="display:none;">
        <p class="jellyConfigInfo">
          Make sure you install and set up <a class="jellyLink" href="https://foosoft.net/projects/anki-connect/">AnkiConnect</a>! Otherwise you won't be able to save flash cards!
        </p>
        <div id="jellyAnkiConfigVersionBox" class="jellyAnkiConfigBox">
          <label for="jellyAnkiConfigVersion" id="jellyAnkiConfigVersionLabel" class="jellyAnkiConfigLabel">Version: </label>
          <input id="jellyAnkiConfigVersion" class="jellyAnkiConfigInput" type="number" />
        </div>
        <div id="jellyAnkiConfigVersionHelp" class="jellyConfigHelp">
          <p>Remeber, this is the version of AnkiConnect, not Anki! As such, it should be a number from 1-6.</p>
        </div>
        <div id="jellyAnkiConfigVersionError" class="jellyConfigError">
          <p>Your version has to be from 1-6! (inclusive)</p>
        </div>
        <div id="jellyAnkiConfigAddressBox" class="jellyAnkiConfigBox">
          <label for="jellyAnkiConfigAddress" class="jellyAnkiConfigAddressLabel">Bind Address:</label>
          <input id="jellyAnkiConfigAddress" class="jellyAnkiConfigInput" type="text"/>
        </div>
        <div id="jellyAnkiConfigAddressHelp" class="jellyConfigHelp">
          <p>If you don't know this, leave it blank. You will only be able to add cards from your computer. See <a class="jellyLink" href="https://foosoft.net/projects/anki-connect/#application-interface-for-developers">AnkiConnect's</a> website for more details.</p>
        </div>
        <div id="jellyAnkiConfigAddressError" class="jellyConfigError">
          <p>Your address has to be an IPv4 address like "192.168.1.0" or "127.0.0.1"!</p>
        </div>
        <div id="jellyAnkiSubmitButtonBox" class="jellyAnkiConfigBox">
          <input type="button" value="Save" class="jellyAnkiConfigInput" id="jellyAnkiConfigSubmit"/>
        </div>
      </div>
      <div id="jellyQuizletConfig" class="jellyConfigBox" style="display:none;">
        <p>
          To use Jelly with Quizlet you must give Jelly access to your account.
        </p>
        <p>
          Note that if you create a new set with Jelly, the program will automatically
          add two cards to that set called `jellySentinel!@#$%^&amp;*()` and
          `jellySentinel)(*&amp;^%$#@!`. this is because Quizlet will not allow you
          to create an empty set. Jelly will automatically try to delete any cards that
          have these term fields every time you add a card to a set. Unfortunately,
          this means that it is impossible to use Jelly with a set that contains a
          card whose term is either of these words (but I highly doubt you will want to
          do that)...
        </p>
        <button id="jellyQuizletGo">Go To Quizlet</button>
      </div>
    </div>
  </body>
  <script src="../js/jquery-3.3.1.min.js"></script>
  <script src="../js/chosen/chosen.jquery.min.js"></script>
  <script src="../js/options.js"></script>
</html>
