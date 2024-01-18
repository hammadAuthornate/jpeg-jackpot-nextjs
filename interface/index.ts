interface nftDetails {
  image?: {
    cachedUrl?: string;
    contentType?: string;
    originalUrl?: string;
  };
  contract?: {
    address?: string;
    contractDeployer?: string;
    openSeaMetadata?: {
      description?: string;
      floorPrice?: number;
    };
  };
  collection?: {
    name?: string;
    slug?: string;
  };
  name?: string;
  name2?: string;
  meta_name?: string;
  tokenId?: string;
  tokenHash?: string;
  tokenAddress?: string;
  token_address?: string;
  contractType?: string;
  amount?: number;
  description?: string;
  tokenUri?: string;
  floor_price?: number;
  current_owner?: string;
  in_pot?: boolean;
  raw?: {
    metadata?: {
      attributes?: {
        trait_type?: string;
        value?: string;
      }[];
    };
  };
  attributes?: {
    trait_type?: string;
    value?: string;
  }[];
  chain?: any;
  floor_price_usd_fe?: number | string;
  metadata?: {
    name?: string;
    image?: string;
    attributes?: any;
  };
}
