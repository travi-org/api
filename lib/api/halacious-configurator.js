export default function (resourceType) {
  return {
    api: resourceType,
    prepare(rep, next) {
      rep.entity[resourceType].forEach(resource => {
        rep.embed(resourceType, `./${resource.id}`, resource);
      });

      rep.ignore(resourceType);

      next();
    }
  };
}
