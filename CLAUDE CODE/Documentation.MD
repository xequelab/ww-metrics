Anatomy of a component
Pre-requisites
We consider that you are familiar with Vue development.

You can see the excellent Vue documentation here.

TIP

WeWeb relies on version 3 of Vue.

There are two files you will edit:

src/wwElement.vue or src/wwSection.vue which is the Vue component displayed in the Editor and the published web-app.
ww-config.js which describes the different properties of your component so that WeWeb knows how to interact with your component
Vue component
See the Development process to load a base component in dev mod.

For now your Vue component is simple. It received the content props from the Editor, and uses it to add some style on text:

js
export default {
  // [...]
  props: {
    content: { type: "Object", required: true },
  },
  computed: {
    textStyle() {
      return {
        color: this.content.textColor,
      };
    },
  },
  // [...]
};
html
<h1 :style="textStyle">My Title</h1>
The content props is where your component's editable data lives. Each time this content changes via the Editor, the component will receive a new updated content object and, thanks to Vue's reactivity, your component will refresh its template.

TIP

WeWeb handles a lot of things for you like translation, responsive or binding so that you will always receive a simple content object without having to think about it.

content can have any shape you want, but we encourage you the keep it as flat as possible, because it interacts better with a lof of WeWeb features. You can put any style and html you want to your component. Just keep in mind that your root element will be editable via WeWeb's default editor.

It is also required that your template has a root element, and is not a fragment.

WARNING

Avoid using link or defining styles like padding which are handled by the Editor.

See a complete list here

ww-config.js
This file describes the metadata of your component. All the desired properties of your content need to be listed here. You also have a lot of options to customize the Editor's side panel, the different menus and interactions inside WeWeb's Editor:

js
export default {
  editor: {
    label: {
      en: "My Element",
    },
  },
  properties: {
    textColor: {
      label: {
        en: "Text color",
      },
      type: "Color",
      defaultValue: "#F23636",
    },
  },
};
editor describes the interaction of your component inside the WeWeb Editor

label is a translated text used by the Editor for the menu, side panel titles, or navigator
A lot of other options are available, there are listed here
properties is an object which describes all your content properties

Each content property will describe the corresponding property inside content (if your property name is textColor, it will be available in this.content.textColor)
type lets WeWeb's Editor display the correct user interface to edit your property. A list of all available types and their options are available here
TIP

Defining all your properties inside ww-config.js is mandatory. You can decide to handle yourself the edition update by using a custom editor interface.

For that, you can use the hidden option to hide it from the edition panel.

Using the configuration file is still the quickest way to make your content editable by users and offer a uniform edition experience for users across all the components.

Add content property
See the Development process to load a base element in dev mod.

We will add a title property on our section, so that the user can dynamically change the title of the section.

ww-config.js
The first step is to declare this property on the properties field of the configuration:

js
properties: {
    // [...]
    title: {
      label: {
        en: "Title",
      },
      type: "Text",
      defaultValue: "My title",
    },
}
Use the value inside the template
html
<div class="my-element">
    <h1>{{ content.title }}</h1>
    <p :style="textStyle">I am a custom element !</p>
  </div>
And that's all!


Add a dropzone
In WeWeb you can easily create a dropzone, an area where the user will be able to drop in any element. It's useful to build very flexible components.

See the Development process to load a base section in dev mod.

We will add a header dropzone instead of our title. The user will be able to drop containers, icons, etc...

ww-config.js
The first step is to declare a new property which will hold the references to all the elements dropped.

We declare this property on the properties field of the configuration:

js
properties: {
    // [...]
    header: {
      hidden: true,
      defaultValue: []
    },
}
TIP

A dropzone needs an array of elements, this is why we initialize it with an empty array.

TIP

We use hidden: true because there is no way to edit this list on the side panel.

Use the value inside the template
We will use a special component: wwLayout.

Full documentation for wwLayout possibilities here

html
<div class="my-section">
    <wwLayout path="header" direction="column" class="header"/>
    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
        ea commodo consequat.
    </p>
</div>
We also need to add some style

css
.my-section {
    // [...]
    .header {
        min-height: 20px;
        display: flex;
        flex-direction: column;
    }
}
WARNING

Be sure to give your wwLayout a minimal width and height or the user will not be able to drop elements inside.

This is the simpliest way to use wwLayout.

We just need to provide the path property which is the path inside the content to access our previously created array.

We also give a direction so that the drop zone appears in the right way.

Customize the item
wwLayout by default just repeats the elements. But it also has a scoped slot you can customize to add extra style or property. This is useful to create a card for example or for the editing experience.

TIP

ww-container for example heavily uses this pattern to add handles for defining the grid.

Here is an example:

js
// ww-config.js
properties: {
    // [...]
    cards: {
      hidden: true,
      defaultValue: []
    },
}
html
<div class="my-section">
    <wwLayout path="cards" direction="row" class="cards">
        <template v-slot="{ item }">
            <wwLayoutItem class="card">
                <wwObject v-bind="item">
            </wwLayoutItem>
        </template>
    </wwLayout>
</div>
css
.my-section {
    .cards {
        display: flex;
        justify-content: space-around;
    }
    .card {
        border: 1px solid dashed;
        padding: 4px;
        border-radius: 8px;
        min-width: 100px;
    }
}
You can see more options of wwLayout here

Bind the content
If you want, you can mark your content property linked to your dropzone as bindable, with a special binding: repeatable

When you do that, wwLayout will repeat its first child element for each item in the collection list bound to it, and it will set a binding context for each item.

js
// ww-config.js
properties: {
    // [...]
    cards: {
      hidden: true,
      bindable: 'repeatable',
      defaultValue: []
    },
}

Add a responsive content property
See the Development process to load a base section in dev mod.

We will add a titleFontSize property on our section, so that the user can dynamically change the font size of the title. We want this size to depend on the breakpoints.

ww-config.js
The first step is to add the default content value:

js
properties: {
    // [...]
    titleFontSize: {
        label: {
            en: "Title font size",
        },
        type: "Length",
        options: {
            unitChoices: [{ "value": "px", "label": "px", "min": 1, "max": 100 }]
        },
        responsive: true,
        defaultValue: "16px"
    },
}
Use the value inside the template
js
export default {
    props: {
        content: { type: "Object", required: true },
    },
    computed: {
        textStyle() {
            return {
                color: this.content.textColor,
                fontSize: this.content.titleFontSize,
            };
        },
    },
};
TIP

Note here that we don't need anything to handle responsive. WeWeb resolves the inheritance of the different breakpoints for you.

We also comment the css style:

css
.my-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 200px;
    // h1 {
    //     font-size: 32px;
    // }
    p {
        margin-top: 12px;
    }
}
Change the ww-config.json
We will add a property inside ww-config.json to add a fontSize length input in the Style panel.

Add a bindable content property
See the Development process to load a base element in dev mod.

We will add a text property on our element, so that the user can dynamically change the text of the element.

ww-config.js
The first step is to declare this property on the properties field of the configuration:

js
properties: {
    // [...]
    title: {
      label: {
        en: "Title",
      },
      type: "Text",
      defaultValue: "My title",
      bindable: true,
    },
}
Use the value inside the template
html
<div class="my-element">
    <h1>{{ content.title }}</h1>
    <p :style="textStyle">I am a custom element!</p>
  </div>
And that's all!

WARNING

Now that this property is bindable, the user can potentially send you any type of data. Your code needs to be defensive, and check the type of this property.

Add translated content property
See the Development process to load a base section in dev mod.

We will add a title property on our section, so that the user can dynamically change the title of the section.

We want this title to change depending on the language of the website.

ww-config.js
The first step is to declare this property on the properties field of the configuration:

js
properties: {
    // [...]
    title: {
      label: {
        en: "Title",
      },
      type: "Text",
      defaultValue: "My title",
      multiLang: true,
    },
}
Use the value inside the template
html
<div class="my-element">
    <h1>{{ wwLib.wwLang.getText(content.title) }}</h1>
    <p :style="textStyle">I am a custom element!</p>
  </div>