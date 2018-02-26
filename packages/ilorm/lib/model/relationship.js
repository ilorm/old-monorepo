'use strict';

const Primary = Symbol('PRIMARY_KEY');
const references = new Map();

const saveRelation = ({ modelA, referenceA, modelB, referenceB, }) => {
  if (!references.has(modelA)) {
    references.set(modelA, new Map());
  }

  references.get(modelA).set(modelB, {
    referenceA,
    referenceB,
  });
};

const declareRelation = ({ modelSource, attributeSource, modelReference, }) => {
  saveRelation({
    modelA: modelSource,
    referenceA: attributeSource,
    modelB: modelReference,
    referenceB: Primary,
  });
  saveRelation({
    modelA: modelReference,
    referenceA: Primary,
    modelB: modelSource,
    referenceB: attributeSource,
  });
};

const getRelation = ({ modelSource, modelReference, }) => references.get(modelSource).get(modelReference);

const isSimple = ({ modelSource, modelReference, }) => {
  const { referenceA, } = getRelation({
    modelSource,
    modelReference,
  });

  return referenceA === Primary;
};



module.exports = {
  declareRelation,
  getRelation,
  Primary,
};
