export default user => doc => {
  const docIsPublic = doc.access.read === 'public';
  const nonOwnersCanView = user && doc.access.read === 'authenticated';
  const userIsOwner = user && doc.owner && user._id === doc.owner._id;
  return docIsPublic || nonOwnersCanView || userIsOwner;
};
