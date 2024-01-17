interface nftDetails {
  image?: string;
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
  token_uri?: string;
  floor_price?: number;
  current_owner?: string;
  in_pot?: boolean;
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
